import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import {
  Download,
  ShieldCheck,
  ShieldAlert,
  Award,
  Calendar,
  MapPin,
  GraduationCap,
  Sparkles,
  Camera,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import IDCardDownloader from "./IDCardDownloader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherIDCardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);

  if (!teacher) return null;

  const isVerified = teacher.verification_status === "approved";
  const teacherId = teacher.teacher_id || "TCH-2026-001";
  const verifyUrl = `https://swatihometuition.in/verify/${teacherId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    verifyUrl
  )}`;

  // Calculate validity date (end of next calendar year, e.g. Dec 31, 2027)
  const currentYear = new Date().getFullYear();
  const validUntilYear = currentYear + 1;
  const validUntilFormatted = `31-DEC-${validUntilYear}`;

  const subjectsDisplay = (teacher.subjects || []).slice(0, 3).join(", ") || "All Subjects";
  const classesDisplay = (teacher.classes_taught || []).slice(0, 2).join(", ") || "Classes 1-12";

  return (
    <div className="space-y-8">
      {/* Print-only CSS to isolate the ID Card during printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #virtual-id-card-container, #virtual-id-card-container * {
                visibility: visible;
              }
              #virtual-id-card-container {
                position: absolute;
                left: 50%;
                top: 50px;
                transform: translateX(-50%);
                margin: 0;
                padding: 0;
                box-shadow: none !important;
                border: none !important;
              }
            }
          `,
        }}
      />

      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">
            Official Faculty ID Badge
          </h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Authorized digital credentials for home visits, parents verification, and student demos across Patna.
          </p>
        </div>

        <Link
          href="/teacher/dashboard/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3E62] bg-[#F9F8F5] hover:bg-[#E8E6DF] px-4 py-2 rounded-xl border border-[#E8E6DF] transition-colors w-fit"
        >
          <Camera className="w-4 h-4 text-[#E5A93C]" />
          Update Profile Photo
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ID Card Display Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E6DF] inline-block w-full max-w-[370px] mx-auto lg:mx-0">
          <div
            id="virtual-id-card-container"
            className="w-full flex justify-center"
          >
            {/* The Actual Downloadable/Printable Physical Badge (CR80 Aspect Ratio) */}
            <div
              id="virtual-id-card"
              className="w-[320px] bg-white rounded-2xl overflow-hidden border-2 border-[#0B192C] shadow-lg relative flex flex-col justify-between"
            >
              {/* Top Security Strip */}
              <div className="h-1.5 bg-gradient-to-r from-[#E5A93C] via-[#1E3E62] to-[#E5A93C] w-full" />

              {/* ID Header with Deep Oxford Navy */}
              <div className="bg-[#0B192C] text-white px-4 pt-3.5 pb-4 text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[#E5A93C] flex items-center justify-center text-[#0B192C] font-bold text-[10px]">
                    S
                  </div>
                  <span className="font-serif font-black tracking-wider text-xs uppercase text-white">
                    Swati Home Tuition Bureau
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-amber-200/90 font-bold">
                  Government Registered Faculty ID · Patna
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">
                    ESTD. 2014
                  </span>
                  <span className="text-[8px] bg-[#E5A93C]/20 text-[#E5A93C] px-2 py-0.5 rounded font-mono font-bold">
                    BIHAR ACADEMIC REGISTRY
                  </span>
                </div>
              </div>

              {/* Main Card Body */}
              <div className="px-5 pt-3 pb-4 bg-gradient-to-b from-white via-[#F9F8F5] to-white relative">
                {/* Photo with Institutional Amber Ring */}
                <div className="flex justify-center -mt-2 mb-2 relative">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border-2 border-[#E5A93C] overflow-hidden relative">
                    {teacher.profile_photo_url ? (
                      <img
                        src={teacher.profile_photo_url}
                        alt={teacher.full_name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-[#0B192C] text-white flex items-center justify-center text-3xl font-bold font-serif">
                        {(teacher.full_name || "T").charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Holographic / Verified Seal Icon */}
                  {isVerified && (
                    <div
                      title="Bureau Verified Tutor"
                      className="absolute bottom-0 right-16 translate-x-3 bg-emerald-600 text-white p-1 rounded-full shadow-md border-2 border-white"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Identity Information */}
                <div className="text-center">
                  <h2 className="font-bold font-serif text-lg text-[#0B192C] leading-tight">
                    {teacher.full_name}
                  </h2>

                  <div className="inline-flex items-center gap-1.5 bg-[#0B192C]/5 px-2.5 py-0.5 rounded-md border border-[#0B192C]/10 mt-1">
                    <span className="text-[10px] font-mono font-bold text-[#1E3E62] tracking-wider">
                      ID: {teacherId}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-[#1E3E62] mt-1.5">
                    {teacher.qualification || "Faculty Member"}
                    {teacher.institution ? ` · ${teacher.institution}` : ""}
                  </p>

                  {/* Verification Badge */}
                  <div className="flex justify-center mt-2">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Authorized Verified Faculty
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 text-[10px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full shadow-xs">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        Verification in Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Teaching Specialties Matrix */}
                <div className="mt-3.5 bg-white p-2.5 rounded-xl border border-[#E8E6DF] space-y-1 text-left">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#5A6578] uppercase">Subjects:</span>
                    <span className="font-semibold text-[#0B192C] truncate max-w-[170px]">
                      {subjectsDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#5A6578] uppercase">Classes:</span>
                    <span className="font-semibold text-[#0B192C] truncate max-w-[170px]">
                      {classesDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#5A6578] uppercase">Patna Locality:</span>
                    <span className="font-semibold text-[#0B192C] truncate max-w-[170px]">
                      {teacher.locality || "Patna"}
                    </span>
                  </div>
                </div>

                {/* Verification QR Code & Bureau Stamp Row */}
                <div className="mt-3.5 pt-3 border-t border-dashed border-[#E8E6DF] flex items-center justify-between gap-3">
                  {/* Validity & Security Info */}
                  <div className="text-left space-y-0.5">
                    <p className="text-[9px] font-bold text-[#5A6578] uppercase tracking-wider">
                      Valid Through
                    </p>
                    <p className="text-xs font-bold text-[#0B192C] font-mono">
                      {validUntilFormatted}
                    </p>
                    <p className="text-[8px] text-[#5A6578] font-mono pt-1">
                      SEC: {teacher.id ? teacher.id.slice(0, 8).toUpperCase() : "SWATI2026"}
                    </p>
                  </div>

                  {/* Circular Bureau Authorized Stamp Graphic */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-[#1E3E62]/40 border-dashed flex flex-col items-center justify-center p-1 text-center rotate-[-8deg] bg-amber-50/40">
                      <span className="text-[6px] font-black uppercase tracking-tighter text-[#1E3E62] leading-none">
                        SWATI HTB
                      </span>
                      <span className="text-[5px] font-bold text-[#E5A93C] uppercase tracking-tight leading-tight my-0.5">
                        ★ AUTH STAMP ★
                      </span>
                      <span className="text-[6px] font-black uppercase text-[#0B192C] leading-none">
                        PATNA REG.
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Parent Verification QR Code */}
                  <div className="w-16 h-16 bg-white p-1 rounded-xl border border-[#0B192C]/20 shadow-xs shrink-0 flex items-center justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="Verification QR"
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="bg-[#0B192C] text-white py-1.5 px-3 text-center border-t border-[#E5A93C]/40">
                <p className="text-[8px] tracking-wide text-neutral-300 font-medium">
                  Scan QR code or visit swatihometuition.in to verify credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Download & Print Controller */}
          <IDCardDownloader
            targetId="virtual-id-card"
            teacherName={teacher.full_name}
            teacherId={teacherId}
            verifyUrl={verifyUrl}
          />
        </div>

        {/* Instructions & Verification Details */}
        <div className="flex-1 space-y-6 max-w-xl">
          {/* Card Features / How to Use */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
            <h3 className="font-bold font-serif text-lg text-[#0B192C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E5A93C]" />
              Official Home Tutor Identification Protocol
            </h3>
            <p className="text-xs text-[#5A6578] leading-relaxed">
              As part of Swati Home Tuition Bureau's Patna safety and high-trust framework, every approved educator carries this verified digital badge.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-lg bg-[#0B192C]/10 text-[#0B192C] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B192C]">
                    Show at Demo Sessions & First Home Visits
                  </h4>
                  <p className="text-xs text-[#5A6578] mt-0.5">
                    Parents in Boring Road, Kankarbagh, and across Patna appreciate seeing the official badge on your phone before starting demo classes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-lg bg-[#0B192C]/10 text-[#0B192C] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B192C]">
                    Instant Live QR Verification
                  </h4>
                  <p className="text-xs text-[#5A6578] mt-0.5">
                    When parents scan the QR with any smartphone camera, it loads your official verified profile page hosted on{" "}
                    <code className="text-[11px] font-mono text-[#0B192C]">swatihometuition.in</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-lg bg-[#0B192C]/10 text-[#0B192C] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B192C]">
                    High-Res Physical Print Option
                  </h4>
                  <p className="text-xs text-[#5A6578] mt-0.5">
                    You can download the high-resolution PNG or click Print to laminate a pocket-sized physical badge for your tutor kit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Link Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-3">
            <h3 className="font-bold text-sm text-[#0B192C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              Direct Parent Verification URL
            </h3>
            <p className="text-xs text-[#5A6578]">
              You can send this official link directly to parents on WhatsApp before confirming your home demo:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={verifyUrl}
                className="flex-1 text-xs font-mono bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl p-2.5 text-[#0B192C] outline-none"
              />
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E3E62] hover:bg-[#0B192C] text-white p-2.5 rounded-xl transition-colors shrink-0"
                title="Open Verification Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
