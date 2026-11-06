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
  Star,
} from "lucide-react";
import { InstagramIcon } from "@/components/shared/SocialIcons";
import Link from "next/link";
import QRCode from "qrcode";
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
  let qrCodeUrl = "";
  try {
    qrCodeUrl = await QRCode.toDataURL(verifyUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: "#0B192C",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (e) {
    qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      verifyUrl
    )}`;
  }

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
                <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">
                    ESTD. 2014
                  </span>
                  <span className="text-[8px] bg-[#E5A93C]/20 text-[#E5A93C] px-2 py-0.5 rounded font-mono font-bold">
                    BIHAR ACADEMIC REGISTRY
                  </span>
                  <span className="text-[8px] bg-white/15 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-white/20">
                    <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    GBP VERIFIED · 4.9 ★
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

                  {/* Verification & GBP Badges */}
                  <div className="flex flex-col items-center gap-1.5 mt-2">
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

                    <div className="inline-flex items-center gap-1.5 bg-[#F9F8F5] border border-[#E8E6DF] px-2.5 py-0.5 rounded-md">
                      <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span className="text-[9px] font-bold text-[#0B192C]">
                        GBP Verified Entity · 4.9 ★ Rating
                      </span>
                    </div>
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

              {/* Bottom Card Footer with Official Social Tags & Registration */}
              <div className="bg-[#0B192C] text-white py-2 px-3 text-center border-t border-[#E5A93C]/40 space-y-1">
                <div className="flex items-center justify-between text-[7.5px] text-amber-200/90 font-semibold px-0.5">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                    GBP Verified · 4.9★
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-white/95">
                    IG: @swati.htb
                  </span>
                </div>
                <p className="text-[7px] tracking-wide text-neutral-300 font-medium">
                  Scan QR or visit swatihometuition.in to verify faculty identity.
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
            teacherPhotoUrl={teacher.profile_photo_url}
            teacherQualification={teacher.qualification}
            teacherInstitution={teacher.institution}
            teacherLocality={teacher.locality}
            subjectsDisplay={subjectsDisplay}
            classesDisplay={classesDisplay}
            isVerified={isVerified}
            validUntil={validUntilFormatted}
            qrDataUrl={qrCodeUrl}
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

          {/* Official GBP & Social Registry Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0B192C] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Google Verified Bureau Credentials
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                4.9 ★ Google Verified
              </span>
            </div>

            <p className="text-xs text-[#5A6578] leading-relaxed">
              Swati Home Tuition Bureau is Patna&apos;s highest-rated home tutoring bureau on Google. Your ID badge reflects our authorized registry accreditation.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <a
                href="https://instagram.com/swati.htb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#F9F8F5] hover:bg-pink-50/50 rounded-xl border border-[#E8E6DF] transition-colors group block"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A6578] uppercase group-hover:text-pink-600">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                  Official Instagram
                </div>
                <p className="font-bold text-[#0B192C] mt-0.5 font-mono group-hover:text-pink-700">@swati.htb</p>
              </a>
              <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A6578] uppercase">
                  <Star className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
                  Google Verified
                </div>
                <p className="font-bold text-[#0B192C] mt-0.5 font-mono">4.9 ★ Rating</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between">
              <span className="text-[11px] text-[#5A6578]">Help us strengthen bureau rating:</span>
              <a
                href="https://share.google/tarSWReEvLi7cim5V"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B192C] hover:text-[#1E3E62] underline"
              >
                Rate Swati HTB on Google ★ <ExternalLink className="w-3 h-3 text-[#E5A93C]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
