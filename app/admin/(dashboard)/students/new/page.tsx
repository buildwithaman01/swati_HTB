import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, ShieldAlert } from "lucide-react";

export default function AdminNewStudent() {
  async function createStudent(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    
    const subjects = (formData.get("subjects_required") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];

    const parentPhoneVal = (formData.get("parent_phone") as string)?.trim() || "";
    const rawWhatsapp = (formData.get("whatsapp") as string)?.trim();
    const whatsappVal = rawWhatsapp || parentPhoneVal || null;

    const emailVal = (formData.get("email") as string)?.trim() || null;
    const addressVal = (formData.get("address") as string)?.trim() || null;
    const budgetVal = (formData.get("budget_range") as string)?.trim() || null;
    const notesVal = (formData.get("internal_notes") as string)?.trim() || null;
    const timingVal = (formData.get("preferred_timing") as string)?.trim() || null;
    const specialNeedsVal = (formData.get("special_needs") as string)?.trim() || null;
    const genderPref = (formData.get("gender_preference") as string) || "no_preference";

    const { data, error } = await adminSupabase.from("students").insert({
      full_name: (formData.get("full_name") as string)?.trim(),
      parent_name: (formData.get("parent_name") as string)?.trim(),
      parent_phone: parentPhoneVal,
      parent_whatsapp: whatsappVal,
      whatsapp: whatsappVal,
      email: emailVal,
      parent_email: emailVal,
      locality: (formData.get("locality") as string)?.trim(),
      address: addressVal,
      class_studying: (formData.get("class_studying") as string)?.trim(),
      board: (formData.get("board") as string) || "CBSE",
      subjects_required: subjects,
      subjects_needed: subjects,
      tuition_type_preference: (formData.get("tuition_type_preference") as string) || "home",
      gender_preference: genderPref,
      preferred_timing: timingVal,
      special_needs: specialNeedsVal,
      budget_range: budgetVal,
      enrollment_status: (formData.get("enrollment_status") as string) || "enquiry",
      internal_notes: notesVal
    }).select("id").single();

    if (error) {
      console.error("Student creation error:", error);
      throw new Error(`Failed to create student: ${error.message}`);
    }

    revalidatePath("/admin/students");
    redirect(`/admin/students/${data.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/students" 
          className="p-2 rounded-xl bg-white border border-[#E8E6DF] hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0B192C]">Add New Student</h1>
          <p className="text-sm text-neutral-500 mt-1">Register a new student enquiry, demo booking, or confirmed admission.</p>
        </div>
      </div>

      <form action={createStudent} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E8E6DF] space-y-8 font-sans">
        
        {/* Student & Parent Details */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Personal &amp; Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Student Full Name *</label>
              <input 
                name="full_name" 
                required 
                placeholder="e.g. Aarav Sharma"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Parent / Guardian Name *</label>
              <input 
                name="parent_name" 
                required 
                placeholder="e.g. Rajesh Sharma"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Parent Calling Phone *</label>
              <input 
                name="parent_phone" 
                required 
                placeholder="10-digit mobile number"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">WhatsApp Number</label>
              <input 
                name="whatsapp" 
                placeholder="Leave blank if same as calling phone"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Parent Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="parent@example.com (used for Parent Portal login)"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Locality (Patna Neighborhood) *</label>
              <input 
                name="locality" 
                required 
                placeholder="e.g. Boring Road, Kankarbagh, Rajendra Nagar" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Full Residential Address</label>
              <input 
                name="address" 
                placeholder="Apartment, House No., Landmark" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Academic Details */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Academic Requirements &amp; Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Class / Grade *</label>
              <input 
                name="class_studying" 
                required 
                placeholder="e.g. Class 10, Class 12 PCM" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Board *</label>
              <select 
                name="board" 
                required 
                defaultValue="CBSE"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">Bihar State Board (BSEB)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Subjects Required (comma-separated)</label>
              <input 
                name="subjects_required" 
                placeholder="e.g. Mathematics, Physics, Chemistry" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Tutor Gender Preference</label>
              <select 
                name="gender_preference" 
                defaultValue="no_preference"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white"
              >
                <option value="no_preference">No Preference (Any Qualified Tutor)</option>
                <option value="female">Female Tutor Preferred (Strict)</option>
                <option value="male">Male Tutor Preferred</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Tuition Format</label>
              <select 
                name="tuition_type_preference" 
                defaultValue="home"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white"
              >
                <option value="home">In-Home Tuition (At Student's House)</option>
                <option value="online">Online 1-on-1</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Preferred Timing</label>
              <input 
                name="preferred_timing" 
                placeholder="e.g. 5:00 PM – 7:00 PM or Morning" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Budget Range (₹/month)</label>
              <input 
                name="budget_range" 
                placeholder="e.g. ₹4,500 – ₹6,000" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Status & Administration */}
        <section>
          <h3 className="text-xs font-bold text-[#1E3E62] uppercase tracking-wider mb-4 border-b border-[#E8E6DF] pb-2">
            Status &amp; Internal Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Initial Status</label>
              <select 
                name="enrollment_status" 
                defaultValue="enquiry"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-neutral-50 font-medium"
              >
                <option value="enquiry">Enquiry (Under Review)</option>
                <option value="demo">Demo Stage (Trial Class Arranged)</option>
                <option value="enrolled">Enrolled (Active Monthly Tuition)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Special Academic Focus / Needs</label>
              <input 
                name="special_needs" 
                placeholder="e.g. Weak in Board exam proofs, needs foundation revision" 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-1">Internal Bureau Notes</label>
              <textarea 
                name="internal_notes" 
                rows={3} 
                placeholder="Any special parent requirements, fee negotiation notes, or coordinator follow-ups..." 
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none" 
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 flex justify-end gap-3 border-t border-[#E8E6DF]">
          <Link 
            href="/admin/students" 
            className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="bg-[#0B192C] hover:bg-[#1E3E62] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md cursor-pointer border-b-[2px] border-[#E5A93C]"
          >
            <UserPlus size={18} className="text-[#E5A93C]" /> Add Student Profile
          </button>
        </div>

      </form>
    </div>
  );
}
