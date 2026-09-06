import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { token, rating, review_text, parent_name } = await req.json();
    const supabase = await createAdminClient();

    // Find the review record by token
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("id, token_used, teacher_id, student_id")
      .eq("review_token", token)
      .single();

    if (fetchError || !review) {
      return NextResponse.json({ error: "Invalid or expired review link." }, { status: 404 });
    }

    if (review.token_used) {
      return NextResponse.json({ error: "This review link has already been used." }, { status: 409 });
    }

    // Update the review with the submitted data
    await supabase.from("reviews").update({
      rating,
      review_text,
      parent_name: parent_name || null,
      token_used: true,
      is_verified: false,
      is_public: false,
    }).eq("review_token", token);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
