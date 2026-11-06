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

  const { data: teacherList } = await query.order("created_at", { ascending: false }).limit(1);
  const teacher = teacherList?.[0] || null;

  if (!teacher) return notFound();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: sessionCountThisMonth } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", teacher.id)
    .gte("session_date", startOfMonth.toISOString());

  // Fetch teacher's active assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      *,
      student:students(id, full_name, student_id, class_studying, parent_name, parent_phone, whatsapp)
    `)
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });


  // Generate secure signed URL for private KYC documents
  let idProofViewUrl = null;
  if (teacher.id_proof_url) {
    let cleanDocName = teacher.id_proof_url.trim();
    if (cleanDocName.includes("kyc-documents/")) {
      cleanDocName = cleanDocName.split("kyc-documents/").pop()?.split("?")[0] || cleanDocName;
    }

    if (teacher.id_proof_url.includes("?token=")) {
      idProofViewUrl = teacher.id_proof_url;
    } else {
      const { data: signed } = await supabase.storage
        .from("kyc-documents")
        .createSignedUrl(decodeURIComponent(cleanDocName), 7200);
      idProofViewUrl = signed?.signedUrl || `/api/docs/view?file=${encodeURIComponent(cleanDocName)}`;
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
              ) : (teacher.full_name || "T").charAt(0)}
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
                teacher.verification_status === "approved" 
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                  : teacher.verification_status === "pending" 
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : teacher.verification_status === "on_leave"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : teacher.verification_status === "inactive"
                  ? "bg-neutral-100 text-neutral-700 border border-neutral-300"
                  : "bg-red-100 text-red-800 border border-red-200"
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
            teacherName={teacher.full_name}
            currentStatus={teacher.verification_status}
            badgeLevel={teacher.badge_level}
            initialNotes={teacher.internal_notes}
            initialRejectionReason={teacher.rejection_reason}
          />
        </div>

        {/* Right Col - Full Data Form */}
        <div className="lg:col-span-2 space-y-6">
          <TeacherProfileForm teacher={teacher} />

          {/* Assigned Students */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0F4C5C]" /> Assigned Students & Tuitions ({assignments?.length || 0})
              </h2>
              <Link
                href={`/admin/assignments/new?teacher_id=${teacher.id}`}
                className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                + Assign Student
              </Link>
            </div>

            {!assignments || assignments.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">No students currently assigned to this teacher.</p>
                <Link
                  href={`/admin/assignments/new?teacher_id=${teacher.id}`}
                  className="inline-block mt-2 text-xs font-bold text-[#0F4C5C] hover:underline"
                >
                  Click here to assign a student →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="border border-neutral-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-neutral-50/50 hover:bg-white transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/students/${assignment.student?.id || assignment.student_id}`}
                          className="font-bold text-sm text-[#1F2937] hover:text-[#0F4C5C] hover:underline"
                        >
                          {assignment.student?.full_name || "Student"}
                        </Link>
                        <span className="text-xs text-neutral-400 font-mono">
                          ({assignment.student?.student_id || "STD"})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        <span className="font-semibold text-neutral-700">{assignment.subject}</span> · Class{" "}
                        {assignment.student?.class_studying || "?"} · Parent: {assignment.student?.parent_name} (
                        {assignment.student?.parent_phone})
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Schedule: {assignment.classes_per_week}x/week · {assignment.session_duration_mins} mins
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          assignment.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : assignment.status === "paused"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {assignment.status}
                      </span>
                      <p className="text-xs font-bold text-[#1F2937] mt-1">
                        Fee: ₹{Number(assignment.monthly_fee).toLocaleString("en-IN")}/mo
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-600">
                        Teacher: ₹{Number(assignment.teacher_earning).toLocaleString("en-IN")}/mo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
