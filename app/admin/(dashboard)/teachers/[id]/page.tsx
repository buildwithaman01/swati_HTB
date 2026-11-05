import { createAdminClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, User, Phone, MapPin, GraduationCap, CheckCircle2, XCircle, Clock, ShieldCheck, Mail, Map, BookOpen, AlertTriangle, FileText, Save, Check, X, MessageCircle, KeyRound } from "lucide-react";
import AccountManagementCard from "./AccountManagementCard";
import TeacherApprovalAction from "./TeacherApprovalAction";
import TeacherProfileForm from "./TeacherProfileForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawId = (id || "").trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);

  const supabase = await createAdminClient();
  
  let query = supabase.from("teachers").select("*");
  if (isUuid) {
    query = query.eq("id", rawId);
  } else {
    query = query.eq("teacher_id", rawId.toUpperCase());
  }

  const { data: teacher } = await query.maybeSingle();

  if (!teacher) return notFound();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);
  
  const { count: sessionCountThisMonth } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", teacher.id)
    .gte("session_date", startOfMonth.toISOString());


  // Generate secure 1-hour signed URL for private KYC documents
  let idProofViewUrl = null;
  if (teacher.id_proof_url) {
    if (teacher.id_proof_url.startsWith("http")) {
      idProofViewUrl = teacher.id_proof_url;
    } else {
      const { data: signed } = await supabase.storage
        .from("kyc-documents")
        .createSignedUrl(teacher.id_proof_url, 3600);
      idProofViewUrl = signed?.signedUrl || null;
    }
  }



  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/teachers" className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Teacher Profile</h1>
          <p className="text-sm text-neutral-500 font-mono mt-1">{teacher.teacher_id} · Registered {new Date(teacher.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Identity & Status */}
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-3xl mb-4 relative shadow-md">
              {teacher.profile_photo_url ? (
                <img src={teacher.profile_photo_url} className="w-full h-full rounded-full object-cover" />
              ) : teacher.full_name.charAt(0)}
              {teacher.verification_status === "approved" && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#1F2937]">{teacher.full_name}</h2>
            <p className="text-sm text-neutral-500 mt-1">{teacher.qualification}</p>
            
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                teacher.verification_status === "approved" ? "bg-emerald-100 text-emerald-700" : 
                teacher.verification_status === "pending" ? "bg-amber-100 text-amber-700" : 
                "bg-red-100 text-red-700"
              }`}>
                {teacher.verification_status}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                <ShieldCheck className="w-3.5 h-3.5" /> {teacher.badge_level}
              </span>
            </div>
            
            <div className="mt-4 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200/60 w-full flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sessions this month</span>
              <span className="font-bold text-lg text-[#0F4C5C]">{sessionCountThisMonth || 0}</span>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
            <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-2">Contact Info</h3>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{teacher.phone}</p>
                <p className="text-xs text-neutral-500">WhatsApp: {teacher.whatsapp || "Same"}</p>
              </div>
            </div>
            {teacher.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-sm text-[#1F2937] break-all">{teacher.email}</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{teacher.locality}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{teacher.address}</p>
              </div>
            </div>
          </div>

          {/* Interactive Approval Action Card */}
          <TeacherApprovalAction
            teacherId={teacher.id}
            currentStatus={teacher.verification_status}
            badgeLevel={teacher.badge_level}
            initialNotes={teacher.internal_notes}
            initialRejectionReason={teacher.rejection_reason}
          />
        </div>

        {/* Right Col - Full Data Form */}
        <div className="lg:col-span-2 space-y-6">
          <TeacherProfileForm teacher={teacher} />

          {/* Account Management */}
          <AccountManagementCard 
            teacherId={teacher.id}
            teacherName={teacher.full_name}
            teacherEmail={teacher.email || ""}
            teacherPhone={teacher.whatsapp || teacher.phone || ""}
            authUserId={teacher.auth_user_id || null}
            verificationStatus={teacher.verification_status}
          />

          {/* Docs / Verification Data (Read only) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F4C5C]" /> Verification Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocBox title="Aadhar Card" value={teacher.aadhar_number} url={idProofViewUrl} />
              <DocBox title="PAN Card" value={teacher.pan_number} url={null} />
              <DocBox title="Police Verification" value={teacher.police_verified ? "Verified" : "Not Verified"} url={teacher.police_cert_url} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DocBox({ title, value, url }: { title: string; value: string | null; url: string | null }) {
  return (
    <div className="p-4 border border-neutral-100 rounded-2xl bg-neutral-50/50">
      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1F2937]">{value || "Not provided"}</p>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0F4C5C] hover:underline">
            View Doc
          </a>
        )}
      </div>
    </div>
  );
}
