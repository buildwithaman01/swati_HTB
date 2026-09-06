import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { randomBytes } from "crypto";

// Generate a review token for a specific assignment
export async function POST(req: NextRequest) {
  try {
    const { assignmentId, teacherId, studentId } = await req.json();
    const supabase = await createAdminClient();

    // Check if a token already exists for this assignment
    const { data: existing } = await supabase
      .from("reviews")
      .select("review_token, token_used")
      .eq("assignment_id", assignmentId)
      .eq("token_used", false)
      .single();

    if (existing) {
      return NextResponse.json({ token: existing.review_token });
    }

    // Generate new token
    const token = randomBytes(20).toString("hex");

    await supabase.from("reviews").insert({
      assignment_id: assignmentId,
      teacher_id: teacherId,
      student_id: studentId,
      review_token: token,
    });

    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
