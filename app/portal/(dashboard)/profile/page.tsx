import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StudentProfileEditor from "./StudentProfileEditor";
import { StudentPortalSocialCard } from "@/components/promotions/PromotionBanners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const adminClient = await createAdminClient();
  const { data: student } = await adminClient
    .from("students")
    .select("*")
    .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Student Profile</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Keep your student's photo, school details, target scores, and weak subjects up-to-date.
        </p>
      </div>

      {/* Official Student Enrollment Verification & Social Bureau Card */}
      <StudentPortalSocialCard
        studentName={student.full_name}
        studentClass={`Class ${student.class_studying || ""}`}
        enrollmentStatus={student.enrollment_status || "Active Student"}
      />

      <StudentProfileEditor student={student} />
    </div>
  );
}
