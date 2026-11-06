import { supabaseAdmin } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Shield, ExternalLink, Star, MessageCircle, PhoneCall } from "lucide-react";
import { VerificationSocialTrustBadges } from "@/components/promotions/PromotionBanners";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";

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
    <main className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-lg">
        {/* Verification Safety Shield Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#0B192C] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#E5A93C]/40 shadow-xs">
            <Shield className="w-4 h-4 text-[#E5A93C]" />
            Swati HTB Safety Shield • Patna
          </div>
          <p className="text-[#5A6578] text-sm">Verifying Educator ID: <code className="font-bold text-[#0B192C] bg-white px-2 py-0.5 rounded border border-[#E8E6DF]">{displayId}</code></p>
        </div>

        <div className={`bg-white rounded-3xl overflow-hidden shadow-xl border-2 ${isValid ? "border-emerald-500" : "border-red-400"}`}>
          {/* Status Banner */}
          <div className={`p-8 text-center ${isValid ? "bg-emerald-50/70 border-b border-emerald-100" : "bg-red-50/70 border-b border-red-100"}`}>
            {isValid
              ? <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-3" />
              : <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
            }
            <h1 className={`font-display text-2xl sm:text-3xl font-extrabold ${isValid ? "text-emerald-950" : "text-red-950"}`}>
              {isValid ? "Officially Verified Educator" : "ID Not Verified"}
            </h1>
            <p className={`text-sm mt-2 max-w-sm mx-auto leading-relaxed ${isValid ? "text-emerald-800" : "text-red-800"}`}>
              {isValid
                ? "This educator has passed physical Aadhaar inspection and academic verification at our Mithapur office."
                : "This Teacher ID was not found or the educator is not currently active. Please contact our official bureau helpline immediately."}
            </p>
          </div>

          {isValid && teacher && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Educator Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#0B192C] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0 border-2 border-[#E5A93C]">
                  {teacher.profile_photo_url
                    ? <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                    : (teacher.full_name || "T").charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-[#0B192C] text-xl leading-tight">{teacher.full_name}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#005F56] mt-0.5">{BADGE[teacher.badge_level] || "Verified Teacher"}</p>
                  <p className="text-xs text-[#5A6578] font-mono mt-0.5">{teacher.teacher_id}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E8E6DF] text-sm">
                <Row label="Teacher ID" value={teacher.teacher_id} />
                {teacher.qualification && <Row label="Qualification" value={`${teacher.qualification}${teacher.institution ? ` (${teacher.institution})` : ''}`} />}
                <Row label="Subjects" value={(teacher.subjects || []).join(", ") || "—"} />
                <Row label="Classes" value={(teacher.classes_taught || []).join(", ") || "—"} />
                <Row label="Service Areas" value={(teacher.areas_serviceable || []).join(", ") || "—"} />
                {teacher.gender && <Row label="Gender" value={teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)} />}
                {teacher.approved_date && (
                  <Row label="Verified Since" value={new Date(teacher.approved_date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} />
                )}
              </div>

              {displayBio && (
                <div className="pt-3 border-t border-[#E8E6DF]">
                  <span className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-2">Teaching Profile</span>
                  <p className="text-sm text-[#1A1D20] leading-relaxed whitespace-pre-wrap font-sans bg-[#F9F8F5] p-3.5 rounded-xl border border-[#E8E6DF]">{displayBio}</p>
                </div>
              )}

              {/* Reviews Section */}
              <div className="pt-3 border-t border-[#E8E6DF]">
                <h3 className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-3 flex items-center justify-between">
                  <span>Parent Evaluations</span>
                  <span className="bg-[#F3F1EC] text-[#0B192C] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#E8E6DF]">{reviews?.length || 0} Reviews</span>
                </h3>
                
                {!reviews || reviews.length === 0 ? (
                  <p className="text-[#5A6578] text-xs text-center py-2 font-sans">No public reviews logged yet for this educator.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-[#F9F8F5] p-3.5 rounded-xl border border-[#E8E6DF]">
                        <div className="flex gap-1 mb-1.5">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-[#E5A93C] text-[#E5A93C]' : 'text-neutral-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-[#1A1D20] leading-relaxed mb-1 font-sans">"{r.review_text}"</p>
                        <p className="text-[11px] font-bold text-[#005F56]">
                          — {r.parent_name || "Parent"} {r.locality ? `(${r.locality})` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Google Business Profile Review CTA Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-white space-y-3 border border-[#E5A93C]/30 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#E5A93C] font-bold">
                    <GoogleGIcon className="w-4 h-4" />
                    <span>Google Business Profile (4.9★)</span>
                  </div>
                  <div className="flex text-[#E5A93C]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-[#E5A93C]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  Help other Patna parents find honest educators. Leave a verified review for Swati HTB directly on Google Maps.
                </p>
                <a
                  href={CANONICAL_LINKS.googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm border-b-[2px] border-[#B87C1C]"
                >
                  <Star className="w-3.5 h-3.5 fill-[#0B192C]" />
                  <span>Rate Swati HTB 5 Stars on Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Official Social Channels & Helpline */}
              <div className="pt-2">
                <VerificationSocialTrustBadges />
              </div>

              {/* Official Helpline Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={CANONICAL_LINKS.whatsappWithText(`Hi, I am verifying teacher ${teacher.full_name} (${teacher.teacher_id}) and want to book a demo class.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Helpline ({BUREAU_INFO.name})</span>
                </a>

                {teacher.profile_slug && (
                  <Link 
                    href={`/teacher/${teacher.profile_slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    <span>Full Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C]" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {!isValid && (
            <div className="bg-white p-8 text-center space-y-5">
              <p className="text-sm text-[#5A6578] font-sans">
                If someone is claiming to represent Swati Home Tuition Bureau without an active verification badge, please report them immediately to our official bureau helpline.
              </p>
              
              <a 
                href={CANONICAL_LINKS.whatsappWithText(`URGENT: I want to report an unverified person claiming ID ${displayId}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-6 py-3.5 rounded-xl shadow-md text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Report on WhatsApp ({CANONICAL_LINKS.displayPhone})</span>
              </a>

              <div className="pt-4 border-t border-[#E8E6DF] text-left">
                <VerificationSocialTrustBadges />
              </div>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="text-center text-xs text-[#5A6578] mt-6 space-y-1">
          <p>
            Official Helpline: <a href={`tel:${CANONICAL_LINKS.phone}`} className="font-bold text-[#0B192C] hover:underline">{CANONICAL_LINKS.displayPhone}</a> • Mithapur, Patna
          </p>
          <p>
            <Link href="/" className="hover:underline text-[#0B192C] font-semibold">swatihometuition.in</Link> — Swati Home Tuition Bureau
          </p>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4 py-1">
      <span className="text-xs font-semibold text-[#5A6578] uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#0B192C] font-medium text-right">{value}</span>
    </div>
  );
}
