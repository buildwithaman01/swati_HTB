import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Star, CheckCircle2, EyeOff, MessageCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReviews() {
  const supabase = await createAdminClient();

  let reviewsList: any[] = [];

  try {
    // 1. Primary join query using correct PostgREST relationship targets (teachers and students tables)
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id, phone, whatsapp),
        student:students(id, full_name, parent_name, parent_phone)
      `)
      .not("rating", "is", null)
      .order("created_at", { ascending: false });

    if (!error && data) {
      reviewsList = data;
    } else {
      // 2. Resilient fallback: fetch flat reviews and manually resolve relations if PostgREST cache is stale
      const { data: flatReviews } = await supabase
        .from("reviews")
        .select("*")
        .not("rating", "is", null)
        .order("created_at", { ascending: false });

      if (flatReviews && flatReviews.length > 0) {
        const teacherIds = [...new Set(flatReviews.map((r: any) => r.teacher_id).filter(Boolean))];
        const studentIds = [...new Set(flatReviews.map((r: any) => r.student_id).filter(Boolean))];

        const [{ data: teachersData }, { data: studentsData }] = await Promise.all([
          teacherIds.length > 0
            ? supabase.from("teachers").select("id, full_name, teacher_id, phone, whatsapp").in("id", teacherIds)
            : Promise.resolve({ data: [] }),
          studentIds.length > 0
            ? supabase.from("students").select("id, full_name, parent_name, parent_phone").in("id", studentIds)
            : Promise.resolve({ data: [] }),
        ]);

        const teacherMap = new Map((teachersData || []).map((t: any) => [t.id, t]));
        const studentMap = new Map((studentsData || []).map((s: any) => [s.id, s]));

        reviewsList = flatReviews.map((r: any) => ({
          ...r,
          teacher: teacherMap.get(r.teacher_id) || null,
          student: studentMap.get(r.student_id) || null,
        }));
      }
    }
  } catch (err) {
    console.error("Admin reviews fetch error:", err);
  }

  // Recalculates teacher rating average and total count
  async function syncTeacherRating(adminSupabase: any, teacherId: string) {
    if (!teacherId) return;

    const { data: allReviews } = await adminSupabase
      .from("reviews")
      .select("rating")
      .eq("teacher_id", teacherId)
      .eq("is_verified", true);

    if (allReviews && allReviews.length > 0) {
      const validRatings = allReviews.filter((r: any) => typeof r.rating === "number" && r.rating > 0);
      const total = validRatings.length;
      const avg = total > 0 ? validRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 5.0;
      await adminSupabase.from("teachers").update({
        rating_average: Math.round(avg * 100) / 100,
        total_reviews: total,
      }).eq("id", teacherId);
    } else {
      await adminSupabase.from("teachers").update({
        rating_average: 5.0,
        total_reviews: 0,
      }).eq("id", teacherId);
    }
  }

  async function approveReview(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const adminSupabase = await createAdminClient();
    await adminSupabase.from("reviews").update({
      is_verified: true,
      is_public: true,
    }).eq("id", id);

    const { data: reviewRow } = await adminSupabase
      .from("reviews")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (reviewRow?.teacher_id) {
      await syncTeacherRating(adminSupabase, reviewRow.teacher_id);
    }

    revalidatePath("/admin/reviews");
  }

  async function rejectReview(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const adminSupabase = await createAdminClient();
    await adminSupabase.from("reviews").update({
      is_verified: false,
      is_public: false,
    }).eq("id", id);

    const { data: reviewRow } = await adminSupabase
      .from("reviews")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (reviewRow?.teacher_id) {
      await syncTeacherRating(adminSupabase, reviewRow.teacher_id);
    }

    revalidatePath("/admin/reviews");
  }

  const pending = reviewsList.filter((r) => !r.is_verified && r.rating);
  const approved = reviewsList.filter((r) => r.is_verified);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#0B192C]">Reviews Moderation</h1>
        <p className="text-neutral-500 text-sm mt-1">Approve or reject parent reviews before they appear publicly on teacher profiles.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Pending Review</p>
          <p className="font-display text-3xl font-extrabold text-amber-950 mt-1">{pending.length}</p>
        </div>
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Published Live</p>
          <p className="font-display text-3xl font-extrabold text-emerald-950 mt-1">{approved.length}</p>
        </div>
        <div className="bg-white border border-[#E8E6DF] rounded-2xl p-4">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Total Ratings</p>
          <p className="font-display text-3xl font-extrabold text-[#0B192C] mt-1">{reviewsList.length}</p>
        </div>
      </div>

      {/* Pending Reviews Section */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/60">
            <h2 className="font-display font-bold text-[#0B192C] flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
              Pending Approval ({pending.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {pending.map((review) => {
              const teacher = review.teacher as any;
              const student = review.student as any;
              const ratingVal = typeof review.rating === "number" ? review.rating : 5;
              const parentDisplayName = review.parent_name || student?.parent_name || "Parent";
              const teacherDisplayName = teacher?.full_name || "Assigned Educator";

              return (
                <div key={review.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= ratingVal ? "fill-[#E5A93C] text-[#E5A93C]" : "text-neutral-200"}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-[#0B192C]">{ratingVal}/5</span>
                        {review.locality && (
                          <span className="text-xs bg-[#F3F1EC] text-[#1E3E62] px-2 py-0.5 rounded-md font-medium border border-[#E8E6DF] ml-2">
                            {review.locality}
                          </span>
                        )}
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-neutral-800 leading-relaxed font-sans bg-[#F9F8F5] p-3.5 rounded-xl border border-[#E8E6DF]">
                        "{review.review_text || "No written remarks provided."}"
                      </p>

                      {/* Metadata */}
                      <div className="text-xs text-[#5A6578] space-y-1 font-sans">
                        <p>👤 From: <span className="font-semibold text-[#0B192C]">{parentDisplayName}</span></p>
                        <p>🎓 Teacher: <span className="font-semibold text-[#0B192C]">{teacherDisplayName}</span> {teacher?.teacher_id ? `(${teacher.teacher_id})` : ""}</p>
                        <p>📅 Submitted: {review.created_at ? new Date(review.created_at).toLocaleDateString("en-IN") : "Recent"}</p>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <form action={approveReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full bg-[#005F56] hover:bg-[#004740] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm">
                          <CheckCircle2 className="w-4 h-4" /> Approve &amp; Publish
                        </button>
                      </form>
                      <form action={rejectReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer">
                          <EyeOff className="w-4 h-4" /> Reject
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Published Reviews Section */}
      {approved.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8E6DF] bg-emerald-50/40">
            <h2 className="font-display font-bold text-[#0B192C] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Published Reviews ({approved.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {approved.map((review) => {
              const teacher = review.teacher as any;
              const ratingVal = typeof review.rating === "number" ? review.rating : 5;
              const parentDisplayName = review.parent_name || "Parent";
              const teacherDisplayName = teacher?.full_name || "Verified Teacher";

              return (
                <div key={review.id} className="p-5 flex items-start gap-4">
                  <div className="flex gap-0.5 shrink-0 pt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= ratingVal ? "fill-[#E5A93C] text-[#E5A93C]" : "text-neutral-200"}`} 
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-800 leading-relaxed font-sans">
                      "{review.review_text || "Verified parent evaluation."}"
                    </p>
                    <p className="text-xs text-[#5A6578] mt-1 font-sans">
                      {parentDisplayName} · Teacher: <span className="font-semibold text-[#0B192C]">{teacherDisplayName}</span>
                      {review.locality ? ` (${review.locality})` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      Live
                    </span>
                    <form action={rejectReview}>
                      <input type="hidden" name="id" value={review.id} />
                      <button 
                        type="submit" 
                        title="Unpublish Review"
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reviewsList.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-16 text-center">
          <Star className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-[#0B192C]">No Reviews Yet</h3>
          <p className="text-neutral-500 text-sm mt-1 max-w-md mx-auto">
            Generate review links from the Assignments management page and share them directly with parents on WhatsApp to collect verified feedback.
          </p>
        </div>
      )}
    </div>
  );
}
