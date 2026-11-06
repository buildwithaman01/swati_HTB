import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

// Helper to find a review row resiliently regardless of column format
async function findReviewRecord(supabase: any, token: string) {
  if (!token) return null;

  // 1. Try finding by standard `token` column with minimal safe columns
  const { data: byToken, error: errToken } = await supabase
    .from("reviews")
    .select("id, token, rating, teacher_id, student_id, assignment_id, parent_name, locality")
    .eq("token", token)
    .maybeSingle();

  if (byToken) {
    return byToken;
  }

  // 2. If not found or error, try finding by `review_token` column
  try {
    const { data: byReviewToken } = await supabase
      .from("reviews")
      .select("id, rating, teacher_id, student_id, assignment_id, parent_name, locality")
      .eq("review_token", token)
      .maybeSingle();

    if (byReviewToken) {
      return byReviewToken;
    }
  } catch {
    // Ignore error if review_token column does not exist
  }

  return null;
}

// GET: Prefetch review context (tutor details, student info, validity) for parent review form
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json({
        valid: false,
        reason: "missing_token",
        message: "Review token is missing from URL.",
      }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const review = await findReviewRecord(supabase, token);

    if (!review) {
      return NextResponse.json({
        valid: false,
        reason: "not_found",
        message: "This review link is invalid or has expired.",
      }, { status: 404 });
    }

    // Check if review has already been submitted
    if (review.rating != null && Number(review.rating) > 0) {
      return NextResponse.json({
        valid: false,
        reason: "already_used",
        message: "A review has already been submitted with this link. Thank you for your feedback!",
      }, { status: 409 });
    }

    // Prefetch teacher details
    let teacher: any = null;
    if (review.teacher_id) {
      const { data: tData } = await supabase
        .from("teachers")
        .select("id, full_name, profile_photo_url, subjects, qualification, locality, badge_level, rating_average, total_reviews")
        .eq("id", review.teacher_id)
        .maybeSingle();
      teacher = tData;
    }

    // Prefetch student details
    let student: any = null;
    if (review.student_id) {
      const { data: sData } = await supabase
        .from("students")
        .select("id, full_name, parent_name, class_studying, locality")
        .eq("id", review.student_id)
        .maybeSingle();
      student = sData;
    }

    // Prefetch assignment details
    let assignment: any = null;
    if (review.assignment_id) {
      const { data: aData } = await supabase
        .from("assignments")
        .select("id, subject")
        .eq("id", review.assignment_id)
        .maybeSingle();
      assignment = aData;
    }

    const subject = assignment?.subject || (teacher?.subjects && teacher.subjects[0]) || "Tuition";

    return NextResponse.json({
      valid: true,
      reviewId: review.id,
      teacher: teacher ? {
        id: teacher.id,
        name: teacher.full_name,
        photo: teacher.profile_photo_url || null,
        subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
        qualification: teacher.qualification || null,
        locality: teacher.locality || null,
        badgeLevel: teacher.badge_level || "verified",
        ratingAverage: teacher.rating_average || 5.0,
        totalReviews: teacher.total_reviews || 0,
      } : null,
      student: student ? {
        name: student.full_name,
        parentName: student.parent_name || review.parent_name || null,
        classStudying: student.class_studying || null,
        locality: student.locality || null,
      } : null,
      subject,
    });
  } catch (e: any) {
    console.error("[review/submit GET exception]:", e);
    return NextResponse.json({
      valid: false,
      reason: "server_error",
      error: e.message || "Failed to load review details.",
    }, { status: 500 });
  }
}

// POST: Submit a verified parent review
export async function POST(req: NextRequest) {
  try {
    const { token, rating, review_text, parent_name } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Review token is required." }, { status: 400 });
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const trimmedReviewText = (review_text || "").trim();
    if (!trimmedReviewText) {
      return NextResponse.json({ error: "Please write a brief review." }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const review = await findReviewRecord(supabase, token);

    if (!review) {
      return NextResponse.json({ error: "Invalid or expired review link." }, { status: 404 });
    }

    // Single-use enforcement
    if (review.rating != null && Number(review.rating) > 0) {
      return NextResponse.json({
        error: "This review link has already been used to submit feedback.",
      }, { status: 409 });
    }

    // If locality is missing on review, attempt to inherit from student
    let locality = review.locality || null;
    if (!locality && review.student_id) {
      const { data: st } = await supabase
        .from("students")
        .select("locality")
        .eq("id", review.student_id)
        .maybeSingle();
      if (st?.locality) locality = st.locality;
    }

    const updatePayload: Record<string, any> = {
      rating: numericRating,
      review_text: trimmedReviewText,
      parent_name: parent_name ? parent_name.trim() : review.parent_name || null,
      locality,
      token_used: true,
      is_verified: false,
      is_public: false,
    };

    const { error: updateErr } = await supabase
      .from("reviews")
      .update(updatePayload)
      .eq("id", review.id);

    if (updateErr) {
      console.warn("[review/submit] Retrying update without token_used column:", updateErr.message);
      // Fallback if token_used column does not exist in schema
      const { error: fallbackErr } = await supabase
        .from("reviews")
        .update({
          rating: numericRating,
          review_text: trimmedReviewText,
          parent_name: parent_name ? parent_name.trim() : review.parent_name || null,
          locality,
          is_verified: false,
          is_public: false,
        })
        .eq("id", review.id);

      if (fallbackErr) {
        console.error("[review/submit update fallback error]:", fallbackErr);
        return NextResponse.json({ error: "Failed to save review. Please try again." }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your verified review has been submitted for admin approval.",
    });
  } catch (e: any) {
    console.error("[review/submit exception]:", e);
    return NextResponse.json({ error: e.message || "Failed to submit review." }, { status: 500 });
  }
}
