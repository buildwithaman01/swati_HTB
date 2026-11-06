import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TeacherProfileEditor from "./TeacherProfileEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/teacher/login");

  const teacher = await getTeacherProfile(user.id, user.email);

  if (!teacher) redirect("/teacher/login");

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E8E6DF] pb-4">
        <h1 className="text-3xl font-bold font-serif text-[#0B192C]">Faculty Profile</h1>
        <p className="text-sm text-[#5A6578] mt-1 font-medium">
          Customize your public educator profile, photo, qualifications, preferred Patna localities, and teaching credentials.
        </p>
      </div>

      <TeacherProfileEditor teacher={teacher} />
    </div>
  );
}
