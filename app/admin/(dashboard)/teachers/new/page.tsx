import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Save } from "lucide-react";

export default function AdminNewTeacher() {
  async function createTeacher(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    
    // Parse arrays
    const subjects = (formData.get("subjects") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const classes_taught = (formData.get("classes_taught") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const areas_serviceable = (formData.get("areas_serviceable") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];

    const phoneVal = (formData.get("phone") as string)?.trim() || "";
    const rawWhatsapp = (formData.get("whatsapp") as string)?.trim();
    const whatsappVal = rawWhatsapp || phoneVal || null;

    const emailVal = (formData.get("email") as string)?.trim() || null;
    const localityVal = (formData.get("locality") as string)?.trim() || "Patna";
    const addressVal = (formData.get("address") as string)?.trim() || null;
    const institutionVal = (formData.get("institution") as string)?.trim() || null;
    const aadharVal = (formData.get("aadhar_number") as string)?.trim() || null;
    const notesVal = (formData.get("internal_notes") as string)?.trim() || null;
    const statusVal = (formData.get("verification_status") as string) || "pending";
    const isApproved = statusVal === "approved";

    const { data, error } = await adminSupabase.from("teachers").insert({
      full_name: (formData.get("full_name") as string)?.trim(),
      phone: phoneVal,
      whatsapp: whatsappVal,
      email: emailVal,
      gender: (formData.get("gender") as string) || "other",
      qualification: (formData.get("qualification") as string)?.trim(),
      institution: institutionVal,
      experience_years: parseInt(formData.get("experience_years") as string) || 0,
      locality: localityVal,
      address: addressVal,
      aadhar_number: aadharVal,
      subjects,
      classes_taught,
      areas_serviceable,
      verification_status: statusVal,
      badge_level: (formData.get("badge_level") as string) || "verified",
      is_active: isApproved, // auto-activate if approved
      approved_date: isApproved ? new Date().toISOString() : null,
      internal_notes: notesVal
    }).select("id").single();

    if (error) {
      console.error("Teacher creation error:", error);
      throw new Error(`Failed to create teacher: ${error.message}`);
    }

    revalidatePath("/admin/teachers");
    redirect(`/admin/teachers/${data.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/teachers" 
          className="p-2 rounded-xl bg-white border border-[#E8E6DF] hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0B192C]">Add New Educator</h1>
          <p className="text-sm text-neutral-500 mt-1">Register and onboard a verified home tutor into the Patna bureau.</p>
        </div>
      </div>

      <form action={createTeacher} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E8E6DF] space-y-8 font-sans">
        
        {/* Personal Details */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Personal Details &amp; Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Educator Full Name *</label>
              <input 
                name="full_name" 
                required 
                placeholder="e.g. Anjali Verma"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Gender *</label>
              <select 
                name="gender" 
                required 
                defaultValue=""
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white"
              >
                <option value="" disabled>Select Gender...</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Phone Number *</label>
              <input 
                name="phone" 
                required 
                placeholder="10-digit calling number"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">WhatsApp Number</label>
              <input 
                name="whatsapp" 
                placeholder="Leave blank if same as phone"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="tutor@example.com (used for Educator Portal login)"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Aadhaar Card Number</label>
              <input 
                name="aadhar_number" 
                placeholder="12-digit Aadhaar number" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Residential Locality in Patna *</label>
              <input 
                name="locality" 
                required 
                placeholder="e.g. Boring Road, Kankarbagh, Mithapur" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Full Permanent / Present Address</label>
              <input 
                name="address" 
                placeholder="House No, Street, Landmark" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Education & Experience */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Qualifications &amp; Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Highest Qualification *</label>
              <input 
                name="qualification" 
                required 
                placeholder="e.g. B.Tech, M.Sc (Physics), B.Ed" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">College / Institution</label>
              <input 
                name="institution" 
                placeholder="e.g. Patna University, NIT Patna" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Teaching Experience (Years)</label>
              <input 
                type="number" 
                name="experience_years" 
                defaultValue={1} 
                min={0}
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Teaching Preferences */}
        <section>
          <div className="flex justify-between items-end mb-4 border-b border-[#E8E6DF] pb-2">
            <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider">
              Teaching Preferences
            </h3>
            <span className="text-xs text-neutral-400">comma-separated values</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Subjects Taught *</label>
              <input 
                name="subjects" 
                required
                placeholder="e.g. Mathematics, Science, Physics" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Classes / Grades Taught *</label>
              <input 
                name="classes_taught" 
                required
                placeholder="e.g. Class 9-10, Class 11-12, Foundation" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Serviceable Areas in Patna</label>
              <input 
                name="areas_serviceable" 
                placeholder="e.g. Boring Road, Rajendra Nagar, Kankarbagh, Bailey Road" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Verification & Bureau Notes */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Verification Status &amp; Bureau Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Verification Status</label>
              <select 
                name="verification_status" 
                defaultValue="pending"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-neutral-50 font-medium"
              >
                <option value="pending">Pending In-Person Verification</option>
                <option value="approved">Approved &amp; Active Immediately</option>
                <option value="rejected">Rejected / Ineligible</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Badge Level</label>
              <select 
                name="badge_level" 
                defaultValue="verified"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-neutral-50 font-medium"
              >
                <option value="verified">Verified Educator</option>
                <option value="certified">Certified Senior Mentor</option>
                <option value="pending">None (Pending)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Internal Bureau Notes</label>
              <textarea 
                name="internal_notes" 
                rows={2} 
                placeholder="Vetting details, interview notes, demo evaluation score..." 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none" 
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 flex justify-end gap-3 border-t border-[#E8E6DF]">
          <Link 
            href="/admin/teachers" 
            className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="bg-[#0B192C] hover:bg-[#1E3E62] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md cursor-pointer border-b-[2px] border-[#E5A93C]"
          >
            <UserPlus size={18} className="text-[#E5A93C]" /> Create Teacher Profile
          </button>
        </div>

      </form>
    </div>
  );
}
