import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { randomBytes } from "crypto";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Resolves a teacher UUID safely, supporting both UUID primary key and teacher_id code
async function resolveTeacherUUID(supabase: any, teacherInput?: string | null): Promise<string | null> {
  if (!teacherInput) return null;
  const trimmed = teacherInput.trim();

  if (UUID_REGEX.test(trimmed)) {
    const { data } = await supabase.from("teachers").select("id").eq("id", trimmed).maybeSingle();
    if (data?.id) return data.id;
  }

  // Try matching by human-readable teacher_id code (e.g. T-PAT-0042)
  const { data: byCode } = await supabase.from("teachers").select("id").eq("teacher_id", trimmed).maybeSingle();
  if (byCode?.id) return byCode.id;

  return null;
}

// Resolves a student UUID safely, supporting both UUID primary key and student_id code
async function resolveStudentUUID(supabase: any, studentInput?: string | null): Promise<string | null> {
  if (!studentInput) return null;
  const trimmed = studentInput.trim();

  if (UUID_REGEX.test(trimmed)) {
    const { data } = await supabase.from("students").select("id").eq("id", trimmed).maybeSingle();
    if (data?.id) return data.id;
  }

  const { data: byCode } = await supabase.from("students").select("id").eq("student_id", trimmed).maybeSingle();
  if (byCode?.id) return byCode.id;

  return null;
}

// Resolves an assignment safely, returning valid assignment UUID, teacher_id, and student_id
async function resolveAssignment(supabase: any, assignmentInput?: string | null) {
  if (!assignmentInput) return null;
  const trimmed = assignmentInput.trim();

  if (UUID_REGEX.test(trimmed)) {
    const { data } = await supabase
      .from("assignments")
      .select("id, teacher_id, student_id")
      .eq("id", trimmed)
      .maybeSingle();
    if (data?.id) return data;
  }

  const { data: byCode } = await supabase
    .from("assignments")
    .select("id, teacher_id, student_id")
    .eq("assignment_id", trimmed)
    .maybeSingle();
  if (byCode?.id) return byCode;

  return null;
}

// Generate or retrieve a review token for assignments, teachers, or students
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assignmentId, teacherId, studentId } = body;

    if (!assignmentId && !teacherId) {
      return NextResponse.json(
        { error: "Either assignmentId or teacherId is required to generate a review link." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // 1. Resolve and validate assignment foreign keys if assignmentId provided
    let validAssignmentId: string | null = null;
    let resolvedTeacherId: string | null = null;
    let resolvedStudentId: string | null = null;

    if (assignmentId) {
      const asg = await resolveAssignment(supabase, assignmentId);
      if (asg) {
        validAssignmentId = asg.id;
        resolvedTeacherId = asg.teacher_id;
        resolvedStudentId = asg.student_id;
      }
    }

    // 2. Resolve teacher UUID if not already derived from assignment
    if (!resolvedTeacherId && teacherId) {
      resolvedTeacherId = await resolveTeacherUUID(supabase, teacherId);
    }

    // 3. Resolve student UUID if not already derived
    if (!resolvedStudentId && studentId) {
      resolvedStudentId = await resolveStudentUUID(supabase, studentId);
    }

    // Foreign key safety check: teacher_id is NOT NULL in reviews table
    if (!resolvedTeacherId) {
      return NextResponse.json(
        {
          error: "Teacher not found or invalid teacher identifier. A valid teacher is required to generate a review link.",
        },
        { status: 400 }
      );
    }

    // 4. Verify existing unrated review token to avoid duplicate records & token mismatch
    let activeToken: string | null = null;

    if (validAssignmentId) {
      // Check by assignment
      const { data: existingByAsg } = await supabase
        .from("reviews")
        .select("id, token, rating")
        .eq("assignment_id", validAssignmentId)
        .is("rating", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingByAsg?.token) {
        activeToken = existingByAsg.token;
      }
    } else if (resolvedTeacherId && resolvedStudentId) {
      // Check by teacher + student pair
      const { data: existingPair } = await supabase
        .from("reviews")
        .select("id, token, rating")
        .eq("teacher_id", resolvedTeacherId)
        .eq("student_id", resolvedStudentId)
        .is("rating", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingPair?.token) {
        activeToken = existingPair.token;
      }
    }

    // If an active token already exists, return it immediately (guarantees zero token mismatch)
    if (activeToken) {
      return NextResponse.json({
        token: activeToken,
        reviewUrl: `/review/submit?token=${activeToken}`,
      });
    }

    // 5. Generate a new secure 40-character hex token
    const token = randomBytes(20).toString("hex");

    // 6. Insert new review record ensuring zero foreign key violations
    // Setting both token and review_token columns to the exact same value prevents token mismatch
    const fullPayload: Record<string, any> = {
      assignment_id: validAssignmentId,
      teacher_id: resolvedTeacherId,
      student_id: resolvedStudentId,
      token: token,
      review_token: token,
      token_used: false,
    };

    const { error: insertErr } = await supabase.from("reviews").insert(fullPayload);

    if (insertErr) {
      console.warn("[generate-review-token] Retrying with standard token column:", insertErr.message);
      // Fallback 1: minimal standard columns without review_token / token_used
      const { error: fallbackErr } = await supabase.from("reviews").insert({
        assignment_id: validAssignmentId,
        teacher_id: resolvedTeacherId,
        student_id: resolvedStudentId,
        token: token,
      });

      if (fallbackErr) {
        console.warn("[generate-review-token] Retrying with review_token column only:", fallbackErr.message);
        // Fallback 2: in case schema uses review_token instead of token
        const { error: fallback2Err } = await supabase.from("reviews").insert({
          assignment_id: validAssignmentId,
          teacher_id: resolvedTeacherId,
          student_id: resolvedStudentId,
          review_token: token,
        });

        if (fallback2Err) {
          console.error("[generate-review-token insert failed]:", fallback2Err);
          return NextResponse.json(
            { error: "Database error while creating review token: " + fallback2Err.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      token,
      reviewUrl: `/review/submit?token=${token}`,
    });
  } catch (e: any) {
    console.error("[generate-review-token exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to generate review link." }, { status: 500 });
  }
}
