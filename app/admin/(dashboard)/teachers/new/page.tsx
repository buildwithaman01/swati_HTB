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

    const { data, error } = await adminSupabase.from("teachers").insert({
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
      gender: formData.get("gender"),
      qualification: formData.get("qualification"),
      institution: formData.get("institution"),
      experience_years: parseInt(formData.get("experience_years") as string) || 0,
      locality: formData.get("locality"),
      address: formData.get("address"),
      subjects,
      classes_taught,
      areas_serviceable,
      verification_status: formData.get("verification_status"),
      badge_level: formData.get("badge_level"),
      is_active: formData.get("verification_status") === "approved", // auto-activate if approved
    }).select("id").single();

    if (error) {
      console.error(error);
      throw new Error("Failed to create teacher: " + error.message);
    }

    revalidatePath("/admin/teachers");
    redirect(`/admin/teachers/${data.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/teachers" className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Add New Teacher</h1>
          <p className="text-sm text-neutral-500 mt-1">Manually register a teacher into the system</p>
        </div>
      </div>

      <form action={createTeacher} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200/60 space-y-8">
        
        {/* Personal Details */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Full Name *</label>
              <input name="full_name" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Gender *</label>
              <select name="gender" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Phone Number *</label>
              <input name="phone" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">WhatsApp</label>
              <input name="whatsapp" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Email</label>
              <input type="email" name="email" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
          </div>
        </section>

        {/* Education & Experience */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Education & Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Qualification *</label>
              <input name="qualification" required placeholder="e.g. B.Tech, M.Sc" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Institution</label>
              <input name="institution" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Experience (Years)</label>
              <input type="number" name="experience_years" defaultValue={0} className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
          </div>
        </section>

        {/* Teaching Preferences */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2 flex justify-between items-end">
            Preferences <span className="text-xs text-neutral-400 font-normal lowercase tracking-normal">comma-separated</span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Subjects Taught</label>
              <input name="subjects" placeholder="Maths, Science, English" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Classes Taught</label>
              <input name="classes_taught" placeholder="Class 9, Class 10, Class 11" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Areas Serviceable</label>
              <input name="areas_serviceable" placeholder="Boring Road, Kankarbagh" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
            </div>
          </div>
        </section>

        {/* Initial Status */}
        <section>
          <h3 className="text-sm font-bold text-[#0F4C5C] uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Initial Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Verification Status</label>
              <select name="verification_status" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-neutral-50">
                <option value="pending">Pending</option>
                <option value="approved">Approved & Active</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-1">Badge Level</label>
              <select name="badge_level" className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-neutral-50">
                <option value="pending">None (Pending)</option>
                <option value="verified">Verified</option>
                <option value="certified">Certified</option>
              </select>
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
          <Link href="/admin/teachers" className="px-6 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
            <UserPlus size={18} /> Create Teacher Profile
          </button>
        </div>

      </form>
    </div>
  );
}
