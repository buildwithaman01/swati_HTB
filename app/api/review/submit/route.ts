import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { token, rating, review_text, parent_name } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Review token is required." }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Find review record by either review_token or token column
    let review: any = null;
    const { data: revByReviewToken } = await supabase
      .from("reviews")
      .select("id, token, review_token, token_used, rating, teacher_id, student_id")
      .eq("review_token", token)
      .maybeSingle();

    if (revByReviewToken) {
      review = revByReviewToken;
    } else {
      const { data: revByToken } = await supabase
        .from("reviews")
        .select("id, token, review_token, token_used, rating, teacher_id, student_id")
        .eq("token", token)
        .maybeSingle();
      review = revByToken;
    }

    if (!review) {
      return NextResponse.json({ error: "Invalid or expired review link." }, { status: 404 });
    }

    // Single-use enforcement
    if (review.token_used || review.rating != null) {
      return NextResponse.json({ error: "This review link has already been used to submit feedback." }, { status: 409 });
    }

    // Update the review with submitted data
    const updatePayload: Record<string, any> = {
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      review_text: (review_text || "").trim(),
      parent_name: parent_name ? parent_name.trim() : null,
      token_used: true,
      is_verified: false,
      is_public: false,
    };

    const { error: updateErr } = await supabase
      .from("reviews")
      .update(updatePayload)
      .eq("id", review.id);

    if (updateErr) {
      // Fallback if token_used column does not exist
      console.warn("[review/submit] Retrying update without token_used column:", updateErr.message);
      await supabase.from("reviews").update({
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        review_text: (review_text || "").trim(),
        parent_name: parent_name ? parent_name.trim() : null,
        is_verified: false,
        is_public: false,
      }).eq("id", review.id);
    }

    return NextResponse.json({ success: true, message: "Thank you! Your verified review has been submitted for admin approval." });
  } catch (e: any) {
    console.error("[review/submit exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to submit review." }, { status: 500 });
  }
}
