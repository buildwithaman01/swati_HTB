import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, BookOpen, Star, Shield, CheckCircle2, Clock, Phone } from "lucide-react";
import { TeacherProfileSocialTrust } from "@/components/promotions/PromotionBanners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: list } = await supabaseAdmin
    .from("teachers")
    .select("full_name, qualification, subjects, locality")
    .eq("profile_slug", slug)
    .eq("verification_status", "approved")
    .limit(1);
  const teacher = list?.[0];
  if (!teacher) return { title: "Teacher Not Found — Swati HTB" };
  return {
    title: `${teacher.full_name} — ${teacher.qualification} | Swati Home Tuition Bureau`,
    description: `${teacher.full_name} is a verified home tutor in ${teacher.locality}, Patna. Teaches ${(teacher.subjects || []).join(", ")}. Swati HTB Verified.`,
  };
}

const BADGE: Record<string, { label: string; color: string }> = {
  elite:     { label: "🏆 Swati Elite Teacher",      color: "bg-amber-100 text-amber-800 border-amber-300" },
  certified: { label: "⭐ Swati Certified Teacher",   color: "bg-blue-100 text-blue-800 border-blue-300" },
  verified:  { label: "✅ Swati Verified Teacher",    color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  pending:   { label: "⏳ Pending Verification",      color: "bg-gray-100 text-gray-600 border-gray-300" },
};

export default async function TeacherProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: list } = await supabaseAdmin
    .from("teachers")
    .select("*")
    .eq("profile_slug", slug)
    .eq("verification_status", "approved")
    .eq("is_active", true)
    .limit(1);

  const teacher = list?.[0];

  if (!teacher) notFound();

  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("rating, review_text, parent_name, locality, created_at")
    .eq("teacher_id", teacher.id)
    .eq("is_public", true)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(5);

  const badge = BADGE[teacher.badge_level] || BADGE.verified;
  const waUrl = `https://wa.me/919229738307?text=${encodeURIComponent(`Hi, I want to book a demo class with ${teacher.full_name} (${teacher.teacher_id}).`)}`;

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60">
          <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] h-24" />
          <div className="px-8 pb-8 -mt-12">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[#0B192C] flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4 overflow-hidden border-2 border-[#E5A93C]">
              {teacher.profile_photo_url
                ? <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                : (teacher.full_name || "T").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1F2937]">{teacher.full_name}</h1>
                <p className="text-[#1F2937]/60 mt-0.5 text-sm">{teacher.qualification}{teacher.institution ? ` • ${teacher.institution}` : ""}</p>
                <span className={`inline-block mt-2 text-sm font-semibold px-3 py-1 rounded-full border ${badge.color}`}>{badge.label}</span>
              </div>
              {teacher.total_reviews > 0 && (
                <div className="text-center">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 text-amber-400 ${i <= Math.round(teacher.rating_average) ? "fill-current" : "opacity-25"}`} />)}
                  </div>
                  <p className="text-xs text-[#1F2937]/50 mt-1">{Number(teacher.rating_average).toFixed(1)} · {teacher.total_reviews} reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Sharing & Bureau Verification Trust Card */}
        <TeacherProfileSocialTrust
          teacherName={teacher.full_name}
          teacherId={teacher.teacher_id}
          qualification={teacher.qualification}
          locality={teacher.locality}
        />

        {/* Teaching Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60">
          <h2 className="text-lg font-bold text-[#1F2937] mb-5">Teaching Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Subjects" value={(teacher.subjects || []).join(", ") || "—"} />
            <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Classes" value={(teacher.classes_taught || []).join(", ") || "—"} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Areas" value={(teacher.areas_serviceable || []).join(", ") || teacher.locality || "—"} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Experience" value={`${teacher.experience_years || 0} years`} />
            <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Board" value={(teacher.board_expertise || []).join(", ") || "—"} />
            <InfoRow icon={<Shield className="w-4 h-4" />} label="Gender" value={teacher.gender ? teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1) : "—"} />
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60">
          <h2 className="text-lg font-bold text-[#1F2937] mb-5">Swati Safety Shield</h2>
          <div className="space-y-3">
            <VerRow done label="Aadhar ID Verified" />
            <VerRow done={!!teacher.demo_done} label="Demo Class Completed" />
            {teacher.subject_test_score > 0 && <VerRow done={teacher.subject_test_score >= 80} label={`Subject Test: ${teacher.subject_test_score}%`} />}
            <VerRow done={!!teacher.police_verified} label="Police Verified" />
          </div>
          <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-4">
            <div>
              <p className="text-xs text-[#1F2937]/40 uppercase tracking-widest font-semibold">Teacher ID</p>
              <code className="text-[#0B192C] font-bold text-lg">{teacher.teacher_id}</code>
            </div>
            <Link href={`/verify/${teacher.teacher_id}`} className="text-xs font-bold text-[#0B192C] border border-[#0B192C]/20 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full hover:bg-[#0B192C] hover:text-white transition-colors">
              Verify Credentials →
            </Link>
          </div>
        </div>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] mb-5">Parent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-[#FAF7F2] rounded-2xl p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 text-amber-400 ${s <= r.rating ? "fill-current" : "opacity-20"}`} />)}
                  </div>
                  {r.review_text && <p className="text-[#1F2937]/80 text-sm leading-relaxed mb-2">"{r.review_text}"</p>}
                  <p className="text-xs text-[#1F2937]/40">— {r.parent_name}{r.locality ? `, ${r.locality}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#0B192C] to-[#1E3E62] rounded-3xl p-8 text-center text-white border border-[#E5A93C]/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#E5A93C]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#E5A93C] text-[#0B192C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              100% Satisfaction Guarantee
            </span>
            <h2 className="text-white text-xl sm:text-2xl font-bold font-serif mb-2">Book a FREE Demo Class</h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              WhatsApp our Patna bureau office and we&apos;ll schedule a trial session with {teacher.full_name.split(" ")[0]}.
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              <Phone className="w-5 h-5" /> Book via WhatsApp
            </a>
          </div>
        </div>

        {/* Official Bureau Links & Trust Badges */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm">
          <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider text-center mb-4">
            Official Bureau Social &amp; Verification Channels
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <a
              href="https://share.google/tarSWReEvLi7cim5V"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#E8E6DF] bg-[#F9F8F5] hover:bg-amber-50/50 hover:border-amber-300 transition-colors group"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C] group-hover:text-amber-800">Google Verified (4.9 ★)</p>
                <p className="text-[10px] text-[#5A6578]">Read &amp; Share Reviews</p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/swati.htb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#E8E6DF] bg-[#F9F8F5] hover:bg-pink-50/50 hover:border-pink-300 transition-colors group"
            >
              <svg className="w-4 h-4 fill-pink-600" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C] group-hover:text-pink-700">@swati.htb</p>
                <p className="text-[10px] text-[#5A6578]">Official Instagram</p>
              </div>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61593236635791"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#E8E6DF] bg-[#F9F8F5] hover:bg-blue-50/50 hover:border-blue-300 transition-colors group"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B192C] group-hover:text-blue-800">Swati HTB</p>
                <p className="text-[10px] text-[#5A6578]">Official Facebook</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#0B192C] mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-[#1F2937]/40 uppercase tracking-wide">{label}</p>
        <p className="text-[#1F2937] font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}

function VerRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${done ? "text-emerald-500" : "text-neutral-300"}`} />
      <span className={`text-sm ${done ? "text-[#1F2937]" : "text-[#1F2937]/40"}`}>{label}</span>
    </div>
  );
}