import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { randomBytes } from "crypto";

// Generate a review token for a specific assignment
export async function POST(req: NextRequest) {
  try {
    const { assignmentId, teacherId, studentId } = await req.json();
    const supabase = await createAdminClient();

    // Check if a valid token already exists for this assignment
    const { data: existing } = await supabase
      .from("reviews")
      .select("id, token, review_token, token_used, rating")
      .eq("assignment_id", assignmentId)
      .is("rating", null)
      .maybeSingle();

    if (existing) {
      const activeToken = existing.review_token || existing.token;
      if (activeToken) {
        return NextResponse.json({ token: activeToken });
      }
    }

    // Generate new token
    const token = randomBytes(20).toString("hex");

    // Insert supporting both canonical and legacy column formats
    const payload: Record<string, any> = {
      assignment_id: assignmentId,
      teacher_id: teacherId,
      student_id: studentId,
      token: token,
      review_token: token,
      token_used: false,
    };

    const { error: insertErr } = await supabase.from("reviews").insert(payload);
    if (insertErr) {
      // Fallback if review_token or token_used columns do not exist in schema cache
      console.warn("[generate-review-token] Retrying with minimal token column:", insertErr.message);
      await supabase.from("reviews").insert({
        assignment_id: assignmentId,
        teacher_id: teacherId,
        student_id: studentId,
        token: token,
      });
    }

    return NextResponse.json({ token });
  } catch (e: any) {
    console.error("[generate-review-token exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to generate review link" }, { status: 500 });
  }
}
