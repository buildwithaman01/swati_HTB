import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { randomBytes } from "crypto";

// Generate a review token for a specific assignment
export async function POST(req: NextRequest) {
  try {
    let { assignmentId, teacherId, studentId } = await req.json();
    if (!assignmentId && !teacherId) {
      return NextResponse.json({ error: "assignmentId or teacherId is required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // If teacherId or studentId not provided, look them up from assignment
    if (assignmentId && (!teacherId || !studentId)) {
      const { data: asg } = await supabase
        .from("assignments")
        .select("teacher_id, student_id")
        .eq("id", assignmentId)
        .maybeSingle();

      if (asg) {
        if (!teacherId) teacherId = asg.teacher_id;
        if (!studentId) studentId = asg.student_id;
      }
    }

    // 1. Check if a valid, unrated review token already exists for this assignment
    if (assignmentId) {
      // Safe check using standard base columns
      const { data: existingBase } = await supabase
        .from("reviews")
        .select("id, token, rating")
        .eq("assignment_id", assignmentId)
        .is("rating", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingBase?.token) {
        return NextResponse.json({ token: existingBase.token });
      }

      // Check review_token column if review was saved in review_token
      try {
        const { data: existingAlt } = await supabase
          .from("reviews")
          .select("id, review_token, rating")
          .eq("assignment_id", assignmentId)
          .is("rating", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingAlt?.review_token) {
          return NextResponse.json({ token: existingAlt.review_token });
        }
      } catch {
        // Ignored if review_token column doesn't exist
      }
    }

    // 2. Generate new unique secure token
    const token = randomBytes(20).toString("hex");

    // 3. Attempt insert supporting both canonical and legacy column formats
    const primaryPayload: Record<string, any> = {
      assignment_id: assignmentId || null,
      teacher_id: teacherId,
      student_id: studentId || null,
      token: token,
      review_token: token,
      token_used: false,
    };

    const { error: insertErr } = await supabase.from("reviews").insert(primaryPayload);

    if (insertErr) {
      console.warn("[generate-review-token] Retrying with standard token column:", insertErr.message);
      // Fallback 1: minimal standard columns without review_token / token_used
      const { error: fallbackErr } = await supabase.from("reviews").insert({
        assignment_id: assignmentId || null,
        teacher_id: teacherId,
        student_id: studentId || null,
        token: token,
      });

      if (fallbackErr) {
        console.warn("[generate-review-token] Retrying with review_token column only:", fallbackErr.message);
        // Fallback 2: in case schema uses review_token instead of token
        await supabase.from("reviews").insert({
          assignment_id: assignmentId || null,
          teacher_id: teacherId,
          student_id: studentId || null,
          review_token: token,
        });
      }
    }

    return NextResponse.json({ token });
  } catch (e: any) {
    console.error("[generate-review-token exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to generate review link" }, { status: 500 });
  }
}
