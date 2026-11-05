import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Star, CheckCircle2, EyeOff, Eye, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReviews() {
  const supabase = await createAdminClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      teacher:teacher_id(full_name, teacher_id, phone, whatsapp),
      student:student_id(full_name, parent_name, parent_phone)
    `)
    .not("rating", "is", null)
    .order("created_at", { ascending: false });

  async function approveReview(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("reviews").update({
      is_verified: true,
      is_public: true,
    }).eq("id", id);

    // Update teacher's average rating
    const { data: teacher_id_row } = await adminSupabase
      .from("reviews")
      .select("teacher_id")
      .eq("id", id)
      .single();

    if (teacher_id_row) {
      const { data: allReviews } = await adminSupabase
        .from("reviews")
        .select("rating")
        .eq("teacher_id", teacher_id_row.teacher_id)
        .eq("is_verified", true);

      if (allReviews && allReviews.length > 0) {
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await adminSupabase.from("teachers").update({
          rating_average: Math.round(avg * 100) / 100,
          total_reviews: allReviews.length,
        }).eq("id", teacher_id_row.teacher_id);
      }
    }

    revalidatePath("/admin/reviews");
  }

  async function rejectReview(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("reviews").update({
      is_verified: false,
      is_public: false,
    }).eq("id", id);
    revalidatePath("/admin/reviews");
  }

  const pending = reviews?.filter(r => !r.is_verified && r.rating) || [];
  const approved = reviews?.filter(r => r.is_verified) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Reviews Moderation</h1>
        <p className="text-neutral-500 text-sm mt-1">Approve or reject parent reviews before they appear publicly.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Pending Review</p>
          <p className="text-3xl font-bold text-amber-900 mt-1">{pending.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Published</p>
          <p className="text-3xl font-bold text-emerald-900 mt-1">{approved.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-bold text-[#1F2937] mt-1">{reviews?.length || 0}</p>
        </div>
      </div>

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-amber-50/50">
            <h2 className="font-bold text-[#1F2937] flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              Pending Approval ({pending.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {pending.map((review) => {
              const teacher = review.teacher as any;
              const student = review.student as any;
              const phone = teacher?.whatsapp || teacher?.phone || "";
              const shareMsg = `✅ Your review has been published on Swati HTB! Thank you for your feedback.\n— Swati Home Tuition Bureau`;
              return (
                <div key={review.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-5 h-5 ${s <= review.rating ? "fill-[#D4A017] text-[#D4A017]" : "text-neutral-200"}`} />
                        ))}
                        <span className="ml-2 text-sm font-bold text-[#1F2937]">{review.rating}/5</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-neutral-700 leading-relaxed italic">"{review.review_text}"</p>

                      {/* Meta */}
                      <div className="text-xs text-neutral-500 space-y-1">
                        <p>👤 From: <span className="font-semibold">{review.parent_name || student?.parent_name || "Anonymous"}</span></p>
                        <p>🎓 Teacher: <span className="font-semibold">{teacher?.full_name}</span> ({teacher?.teacher_id})</p>
                        <p>📅 Submitted: {new Date(review.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <form action={approveReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                        </button>
                      </form>
                      <form action={rejectReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <button className="w-full bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-700 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
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

      {/* Published Reviews */}
      {approved.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-emerald-50/40">
            <h2 className="font-bold text-[#1F2937] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Published Reviews ({approved.length})
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {approved.map((review) => {
              const teacher = review.teacher as any;
              return (
                <div key={review.id} className="p-5 flex items-start gap-4">
                  <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-[#D4A017] text-[#D4A017]" : "text-neutral-200"}`} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700 italic truncate">"{review.review_text}"</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {review.parent_name || "Anonymous"} · Teacher: {teacher?.full_name}
                    </p>
                  </div>
                  <span className="shrink-0 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Live</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!reviews || reviews.length === 0) && (
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-16 text-center">
          <Star className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No reviews yet.</p>
          <p className="text-xs text-neutral-400 mt-1">Generate review links from the Assignments page and share with parents.</p>
        </div>
      )}
    </div>
  );
}
