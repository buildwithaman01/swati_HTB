import { createAdminClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, User, Phone, MapPin, GraduationCap, CheckCircle2, XCircle, Clock, ShieldCheck, Mail, Map, BookOpen, AlertTriangle, FileText, Save, Check, X, MessageCircle, KeyRound } from "lucide-react";
import AccountManagementCard from "./AccountManagementCard";

export default async function TeacherDetail({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  
  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", params.id)
    .single();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);
  
  const { count: sessionCountThisMonth } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", params.id)
    .gte("session_date", startOfMonth.toISOString());

  if (!teacher) return notFound();

  // Server actions
  async function updateTeacherStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    const notes = formData.get("internal_notes") as string;
    const rejectionReason = formData.get("rejection_reason") as string;
    const id = formData.get("id") as string;
    
    const adminSupabase = await createAdminClient();
    
    const updateData: any = { 
      verification_status: status,
      internal_notes: notes || null 
    };

    if (status === "approved") {
      updateData.badge_level = "verified";
      updateData.is_active = true;
      updateData.approved_date = new Date().toISOString();
      updateData.rejection_reason = null;
    } else if (status === "rejected") {
      updateData.is_active = false;
      updateData.rejection_reason = rejectionReason || null;
      updateData.badge_level = "pending";
    }

    await adminSupabase.from("teachers").update(updateData).eq("id", id);
    revalidatePath(`/admin/teachers/${id}`);
    revalidatePath(`/admin/teachers`);
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminSupabase = await createAdminClient();
    
    await adminSupabase.from("teachers").update({
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
      gender: formData.get("gender"),
      locality: formData.get("locality"),
      address: formData.get("address"),
      qualification: formData.get("qualification"),
      institution: formData.get("institution"),
      experience_years: parseInt(formData.get("experience_years") as string) || 0,
      profile_visibility: formData.get("profile_visibility"),
      badge_level: formData.get("badge_level"),
      subjects: (formData.get("subjects") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      classes_taught: (formData.get("classes_taught") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      areas_serviceable: (formData.get("areas_serviceable") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
    }).eq("id", id);
    
    revalidatePath(`/admin/teachers/${id}`);
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

          {/* Verification Box */}
          <div className={`rounded-3xl p-6 shadow-sm border ${
            teacher.verification_status === "pending" ? "bg-amber-50 border-amber-200" :
            teacher.verification_status === "approved" ? "bg-emerald-50 border-emerald-200" :
            "bg-red-50 border-red-200"
          }`}>
            <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Approval Action
            </h3>
            
            <form action={updateTeacherStatus} className="space-y-4">
              <input type="hidden" name="id" value={teacher.id} />
              
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Status</label>
                <select name="status" defaultValue={teacher.verification_status} className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved & Active</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Internal Notes (Admin Only)</label>
                <textarea 
                  name="internal_notes" 
                  defaultValue={teacher.internal_notes || ""} 
                  placeholder="Private notes about background check, call, etc."
                  rows={3} 
                  className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Rejection Reason (If rejecting)</label>
                <input 
                  type="text" 
                  name="rejection_reason" 
                  defaultValue={teacher.rejection_reason || ""} 
                  placeholder="Sent to teacher if rejected"
                  className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white"
                />
              </div>

              <button type="submit" className="w-full bg-[#1F2937] text-white font-bold py-2.5 rounded-xl hover:bg-black transition-colors text-sm">
                Save Status
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Full Data Form */}
        <div className="lg:col-span-2 space-y-6">
          <form action={updateProfile} className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <input type="hidden" name="id" value={teacher.id} />
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0F4C5C]" /> Profile Data
              </h2>
              <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                <Save size={16} /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Personal */}
              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Personal</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Full Name</label>
                <input name="full_name" defaultValue={teacher.full_name} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Gender</label>
                <select name="gender" defaultValue={teacher.gender} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Contact & Location */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Contact & Location</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Phone Number</label>
                <input name="phone" defaultValue={teacher.phone} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">WhatsApp</label>
                <input name="whatsapp" defaultValue={teacher.whatsapp || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Email</label>
                <input type="email" name="email" defaultValue={teacher.email || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Full Address</label>
                <textarea name="address" defaultValue={teacher.address || ""} rows={2} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Locality (Short)</label>
                <input name="locality" defaultValue={teacher.locality || ""} placeholder="e.g. Boring Road" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

              {/* Education & Experience */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Education & Expertise</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Highest Qualification</label>
                <input name="qualification" defaultValue={teacher.qualification} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Institution / College</label>
                <input name="institution" defaultValue={teacher.institution || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Years of Experience</label>
                <input type="number" name="experience_years" defaultValue={teacher.experience_years || 0} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

              {/* Preferences */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Teaching Preferences</h3>
                <p className="text-xs text-neutral-400 mb-4">Comma-separated lists</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Subjects Taught</label>
                <input name="subjects" defaultValue={(teacher.subjects || []).join(", ")} placeholder="Mathematics, Science, English" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Classes Taught</label>
                <input name="classes_taught" defaultValue={(teacher.classes_taught || []).join(", ")} placeholder="Class 9, Class 10, JEE" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Serviceable Areas</label>
                <input name="areas_serviceable" defaultValue={(teacher.areas_serviceable || []).join(", ")} placeholder="Boring Road, Kankarbagh" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

              {/* System Settings */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">System Settings</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Profile Visibility</label>
                <select name="profile_visibility" defaultValue={teacher.profile_visibility} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="public">Public (Visible on website)</option>
                  <option value="private">Private (Hidden)</option>
                  <option value="unlisted">Unlisted (Direct link only)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Badge Level</label>
                <select name="badge_level" defaultValue={teacher.badge_level} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="pending">No Badge (Pending)</option>
                  <option value="verified">Verified (Standard)</option>
                  <option value="certified">Certified (Tested)</option>
                  <option value="elite">Elite (Top Tier)</option>
                </select>
              </div>

            </div>
          </form>

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
              <DocBox title="Aadhar Card" value={teacher.aadhar_number} url={teacher.id_proof_url} />
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
