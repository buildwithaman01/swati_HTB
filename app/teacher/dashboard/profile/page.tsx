import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { User, MapPin, BookOpen, GraduationCap, Phone } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const adminClient = await createAdminClient();
  const { data: teacher } = await adminClient
    .from("teachers")
    .select("*")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  if (!teacher) return null;

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const whatsapp = String(formData.get("whatsapp"));
    const areas = String(formData.get("areas")).split(",").map(s => s.trim()).filter(Boolean);
    const subjects = String(formData.get("subjects")).split(",").map(s => s.trim()).filter(Boolean);
    const classes = String(formData.get("classes")).split(",").map(s => s.trim()).filter(Boolean);
    const boards = String(formData.get("boards")).split(",").map(s => s.trim()).filter(Boolean);
    const languages = String(formData.get("languages")).split(",").map(s => s.trim()).filter(Boolean);
    const bio = String(formData.get("bio") || "");
    const profile_photo_url = String(formData.get("profile_photo_url") || "");

    await supabase.from("teachers").update({
      whatsapp,
      areas_serviceable: areas,
      subjects,
      classes_taught: classes,
      board_expertise: boards,
      languages,
      bio,
      profile_photo_url
    }).eq("email", user.email);

    revalidatePath("/teacher/dashboard/profile");
    revalidatePath("/teacher/dashboard");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">My Profile</h1>
        <p className="text-sm text-neutral-500 mt-1">Keep your profile updated to match with the best students.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60 max-w-3xl">
        <form action={updateProfile} className="space-y-6">

          <div className="flex items-center gap-6 pb-6 border-b border-neutral-100">
            <div className="w-24 h-24 bg-neutral-100 rounded-full overflow-hidden shrink-0 border-2 border-neutral-200">
              {teacher.profile_photo_url ? (
                <img src={teacher.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1F2937]">{teacher.full_name}</h2>
              <p className="text-sm text-neutral-500 font-mono mt-1">{teacher.teacher_id} • {teacher.verification_status.toUpperCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <User className="w-3 h-3" /> Profile Photo URL
              </label>
              <input
                type="url"
                name="profile_photo_url"
                defaultValue={teacher.profile_photo_url || ""}
                placeholder="https://..."
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
              <p className="text-xs text-neutral-400 mt-1">Provide a link to your hosted photo (e.g., Google Drive image link).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <Phone className="w-3 h-3" /> WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsapp"
                defaultValue={teacher.whatsapp || ""}
                required
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Areas Serviceable (Comma separated)
              </label>
              <input
                type="text"
                name="areas"
                defaultValue={(teacher.areas_serviceable || []).join(", ")}
                placeholder="e.g. Boring Road, Kankarbagh, Patliputra"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Subjects Taught (Comma separated)
              </label>
              <input
                type="text"
                name="subjects"
                defaultValue={(teacher.subjects || []).join(", ")}
                placeholder="e.g. Mathematics, Physics, Chemistry"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <GraduationCap className="w-3 h-3" /> Classes Taught (Comma separated)
              </label>
              <input
                type="text"
                name="classes"
                defaultValue={(teacher.classes_taught || []).join(", ")}
                placeholder="e.g. Class 10, Class 11, Class 12"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Board Expertise (Comma separated)
              </label>
              <input
                type="text"
                name="boards"
                defaultValue={(teacher.board_expertise || []).join(", ")}
                placeholder="e.g. CBSE, ICSE, State Board"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <User className="w-3 h-3" /> Languages Spoken (Comma separated)
              </label>
              <input
                type="text"
                name="languages"
                defaultValue={(teacher.languages || []).join(", ")}
                placeholder="e.g. English, Hindi"
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                <User className="w-3 h-3" /> Professional Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                defaultValue={teacher.bio || ""}
                placeholder="Tell parents and students about your teaching style, experience, and what makes you a great tutor..."
                className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
