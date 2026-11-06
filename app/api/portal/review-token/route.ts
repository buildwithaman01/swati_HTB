import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { randomBytes } from "crypto";
import { CANONICAL_LINKS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to parent portal." }, { status: 401 });
    }

    const adminClient = await createAdminClient();

    // 1. Locate student linked to this logged-in parent
    const { data: student } = await adminClient
      .from("students")
      .select("id, full_name, parent_name, parent_phone")
      .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
      .limit(1)
      .maybeSingle();

    if (!student) {
      return NextResponse.json({ error: "Student profile not found for this account." }, { status: 404 });
    }

    let assignmentId: string | undefined;
    try {
      const body = await req.json();
      assignmentId = body.assignmentId;
    } catch {
      // Body is optional
    }

    // 2. Fetch the assignment (prioritizing active assignments)
    let query = adminClient
      .from("assignments")
      .select("id, teacher_id, student_id, status, subject, teacher:teachers(id, full_name)")
      .eq("student_id", student.id);

    if (assignmentId) {
      query = query.eq("id", assignmentId);
    } else {
      // Prioritize active assignments
      query = query.order("status", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data: assignments } = await query.limit(1);
    const assignment = assignments?.[0];

    if (!assignment) {
      return NextResponse.json({ error: "No active tuition assignment found to review." }, { status: 404 });
    }

    // Foreign key safety check: Ensure teacher exists in teachers table
    const { data: validTeacher } = await adminClient
      .from("teachers")
      .select("id, full_name")
      .eq("id", assignment.teacher_id)
      .maybeSingle();

    if (!validTeacher) {
      return NextResponse.json(
        { error: "Assigned educator record not found. Please contact support." },
        { status: 404 }
      );
    }

    const teacherDisplayName = validTeacher.full_name || (assignment.teacher as any)?.full_name || "Your Teacher";

    // 3. Check if a review already exists for this assignment
    const { data: existingReviews } = await adminClient
      .from("reviews")
      .select("id, token, rating, review_text")
      .eq("assignment_id", assignment.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const existing = existingReviews?.[0];

    // If parent already submitted a rating
    if (existing && existing.rating != null && Number(existing.rating) > 0) {
      return NextResponse.json({
        alreadyReviewed: true,
        rating: existing.rating,
        reviewText: existing.review_text,
        teacherName: teacherDisplayName,
        googleReviewUrl: CANONICAL_LINKS.googleReviews,
      });
    }

    // If an unrated review token already exists, reuse it (guaranteeing zero token mismatch)
    if (existing?.token) {
      return NextResponse.json({
        alreadyReviewed: false,
        token: existing.token,
        reviewUrl: `/review/submit?token=${existing.token}`,
        teacherName: teacherDisplayName,
      });
    }

    // 4. Generate new token
    const token = randomBytes(20).toString("hex");

    const payload: Record<string, any> = {
      assignment_id: assignment.id,
      teacher_id: validTeacher.id,
      student_id: student.id,
      token: token,
      review_token: token,
      parent_name: student.parent_name,
      token_used: false,
    };

    const { error: insertErr } = await adminClient.from("reviews").insert(payload);
    if (insertErr) {
      // Fallback with minimal columns
      console.warn("[portal/review-token] Retrying with minimal token column:", insertErr.message);
      await adminClient.from("reviews").insert({
        assignment_id: assignment.id,
        teacher_id: validTeacher.id,
        student_id: student.id,
        token: token,
        parent_name: student.parent_name,
      });
    }

    return NextResponse.json({
      alreadyReviewed: false,
      token,
      reviewUrl: `/review/submit?token=${token}`,
      teacherName: teacherDisplayName,
    });
  } catch (e: any) {
    console.error("[portal/review-token exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to prepare review." }, { status: 500 });
  }
}
