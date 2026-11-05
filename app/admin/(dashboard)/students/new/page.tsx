import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function AdminNewStudent() {
  async function createStudent(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    
    const subjects = (formData.get("subjects_required") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];

    const emailVal = (formData.get("email") as string)?.trim() || null;
    const whatsappVal = (formData.get("whatsapp") as string)?.trim() || null;
    const addressVal = (formData.get("address") as string)?.trim() || null;
    const budgetVal = (formData.get("budget_range") as string)?.trim() || null;
    const notesVal = (formData.get("internal_notes") as string)?.trim() || null;

    const { data, error } = await adminSupabase.from("students").insert({
      full_name: formData.get("full_name"),
      parent_name: formData.get("parent_name"),
      parent_phone: formData.get("parent_phone"),
      whatsapp: whatsappVal,
      email: emailVal,
      parent_email: emailVal,
      locality: formData.get("locality"),
      address: addressVal,
      class_studying: formData.get("class_studying"),
      board: formData.get("board") || "CBSE",
      subjects_required: subjects,
      subjects_needed: subjects,
      tuition_type_preference: formData.get("tuition_type_preference") || "home",
      budget_range: budgetVal,
      enrollment_status: formData.get("enrollment_status") || "enquiry",
      internal_notes: notesVal
    }).select("id").single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create student: " + error.message);
    }

    revalidatePath("/admin/students");
    redirect(`/admin/students/${data.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Add New Student</h1>
          <p className="text-sm text-neutral-500 mt-1">Manually register a new student enquiry or enrollment</p>
        </div>
      </div>

      <form action={createStudent} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200/60 space-y-8">
        
        {/* Student & Parent Details */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Student Full Name *</label>
              <input name="full_name" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Parent / Guardian Name *</label>
              <input name="parent_name" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Parent Phone *</label>
              <input name="parent_phone" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">WhatsApp</label>
              <input name="whatsapp" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Email</label>
              <input type="email" name="email" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Full Address</label>
              <textarea name="address" rows={2} className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Locality (Short) *</label>
              <input name="locality" required placeholder="e.g. Boring Road" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
          </div>
        </section>

        {/* Academic Details */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Academic Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Class *</label>
              <input name="class_studying" required placeholder="e.g. 10" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Board *</label>
              <select name="board" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                <option value="">Select...</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Subjects Required</label>
              <input name="subjects_required" placeholder="Maths, Science (comma separated)" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Tuition Preference</label>
              <select name="tuition_type_preference" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                <option value="home">Home Tuition</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Budget Range</label>
              <input name="budget_range" placeholder="e.g. 4000-5000" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
          </div>
        </section>

        {/* Initial Status */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Status & Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Enrollment Status</label>
              <select name="enrollment_status" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-neutral-50">
                <option value="enquiry">Enquiry (Just asking)</option>
                <option value="demo">Demo Stage</option>
                <option value="enrolled">Enrolled (Active tuition)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Internal Notes</label>
              <textarea name="internal_notes" rows={3} placeholder="Any specific requirements from parents..." className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
          <Link href="/admin/students" className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
            <UserPlus size={18} /> Add Student Profile
          </button>
        </div>

      </form>
    </div>
  );
}
