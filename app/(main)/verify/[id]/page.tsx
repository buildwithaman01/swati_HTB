import { supabaseAdmin } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Shield, ExternalLink, Star } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Verify Teacher — Swati Home Tuition Bureau",
  description: "Verify that your home tutor is registered and approved by Swati Home Tuition Bureau, Patna.",
};

const BADGE: Record<string, string> = {
  elite:     "🏆 Elite Teacher",
  certified: "⭐ Certified Teacher",
  verified:  "✅ Verified Teacher",
  pending:   "⏳ Pending",
};

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawId = (id || "").trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);

  let query = supabaseAdmin.from("teachers").select("*");
  if (isUuid) {
    query = query.eq("id", rawId);
  } else {
    query = query.eq("teacher_id", rawId.toUpperCase());
  }

  const { data: teacherList } = await query.order("created_at", { ascending: false }).limit(1);
  const teacher = teacherList?.[0] || null;

  const { data: reviews } = teacher?.id
    ? await supabaseAdmin
        .from("reviews")
        .select("rating, review_text, parent_name, locality, created_at")
        .eq("teacher_id", teacher.id)
        .eq("is_verified", true)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
    : { data: [] };

  const isValid = !!(teacher && teacher.verification_status === "approved" && teacher.is_active);
  const displayId = teacher?.teacher_id || rawId.toUpperCase();

  let displayBio = teacher?.bio || "";
  if (!displayBio && teacher?.internal_notes) {
    try {
      const match = teacher.internal_notes.match(/<!--PROFILE_META:(.*?)-->/s);
      if (match && match[1]) {
        const meta = JSON.parse(match[1]);
        displayBio = meta.bio || "";
      }
    } catch {}
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
            <Shield className="w-4 h-4" />
            Swati Safety Shield
          </div>
          <p className="text-[#1F2937]/50 text-sm">Verifying ID: <code className="font-bold text-[#0F4C5C]">{displayId}</code></p>
        </div>

        <div className={`rounded-3xl overflow-hidden shadow-lg border-2 ${isValid ? "border-emerald-400" : "border-red-400"}`}>
          <div className={`p-8 text-center ${isValid ? "bg-emerald-50" : "bg-red-50"}`}>
            {isValid
              ? <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              : <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
            }
            <h1 className={`text-2xl font-bold ${isValid ? "text-emerald-800" : "text-red-800"}`}>
              {isValid ? "✅ Verified Teacher" : "❌ Not Verified"}
            </h1>
            <p className={`text-sm mt-2 ${isValid ? "text-emerald-600" : "text-red-600"}`}>
              {isValid
                ? "This person is an officially registered and approved tutor at Swati HTB."
                : "This Teacher ID was not found or the teacher is not currently active. Please contact Swati HTB immediately."}
            </p>
          </div>

          {isValid && teacher && (
            <div className="bg-white p-8 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#0F4C5C] flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                  {teacher.profile_photo_url
                    ? <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                    : (teacher.full_name || "T").charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1F2937] text-lg leading-tight">{teacher.full_name}</p>
                  <p className="text-sm font-semibold text-[#0F4C5C]">{BADGE[teacher.badge_level] || "Verified"}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <Row label="Teacher ID" value={teacher.teacher_id} />
                {teacher.qualification && <Row label="Qualification" value={`${teacher.qualification}${teacher.institution ? ` (${teacher.institution})` : ''}`} />}
                <Row label="Subjects" value={(teacher.subjects || []).join(", ") || "—"} />
                <Row label="Classes" value={(teacher.classes_taught || []).join(", ") || "—"} />
                <Row label="Service Areas" value={(teacher.areas_serviceable || []).join(", ") || "—"} />
                {teacher.gender && <Row label="Gender" value={teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)} />}
                {teacher.approved_date && (
                  <Row label="Approved Since" value={new Date(teacher.approved_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} />
                )}
              </div>

              {displayBio && (
                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-[#1F2937]/40 uppercase tracking-wide block mb-2">About</span>
                  <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">{displayBio}</p>
                </div>
              )}

              {/* Reviews Section */}
              <div className="pt-3 border-t border-neutral-100">
                <h3 className="text-sm font-semibold text-[#1F2937]/40 uppercase tracking-wide mb-4 flex items-center gap-2">
                  Parent Reviews <span className="bg-neutral-100 text-[#1F2937] px-2 py-0.5 rounded-full">{reviews?.length || 0}</span>
                </h3>
                
                {!reviews || reviews.length === 0 ? (
                  <p className="text-[#1F2937]/50 text-sm text-center py-2">No public reviews available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-neutral-50 p-4 rounded-2xl">
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-[#1F2937] italic mb-2">"{r.review_text}"</p>
                        <p className="text-xs font-bold text-[#0F4C5C]">
                          — {r.parent_name} {r.locality ? `(${r.locality})` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {teacher.profile_slug && (
                <Link href={`/teacher/${teacher.profile_slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#0F4C5C] hover:bg-[#0a3844] text-white font-bold py-3 rounded-2xl transition-colors mt-6">
                  View Full Profile <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {!isValid && (
            <div className="bg-white p-8 text-center">
              <p className="text-sm text-[#1F2937]/60 mb-4">Contact us immediately to report an unverified person.</p>
              <a href="https://wa.me/919229738307?text=I%20want%20to%20report%20an%20unverified%20tutor"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-2xl">
                Report via WhatsApp
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#1F2937]/40 mt-6">
          <Link href="/" className="hover:underline">swatihometuition.in</Link> — Swati Home Tuition Bureau, Patna
        </p>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  let displayBio = teacher?.bio || "";
  if (!displayBio && teacher?.internal_notes) {
    try {
      const match = teacher.internal_notes.match(/<!--PROFILE_META:(.*?)-->/s);
      if (match && match[1]) {
        const meta = JSON.parse(match[1]);
        displayBio = meta.bio || "";
      }
    } catch {}
  }

  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-xs font-semibold text-[#1F2937]/40 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#1F2937] font-medium text-right">{value}</span>
    </div>
  );
}