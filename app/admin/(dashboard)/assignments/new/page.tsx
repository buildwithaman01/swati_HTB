import { createAdminClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AssignmentCreationForm from "./AssignmentCreationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewAssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ student_id?: string; teacher_id?: string }>;
}) {
  const sp = await searchParams;
  const preSelectedStudentId = sp?.student_id;
  const preSelectedTeacherId = sp?.teacher_id;

  const supabase = await createAdminClient();

  const [{ data: teachers }, { data: students }] = await Promise.all([
    supabase
      .from("teachers")
      .select("id, full_name, teacher_id, locality, subjects, phone, whatsapp, verification_status")
      .order("full_name"),
    supabase
      .from("students")
      .select("id, full_name, student_id, class_studying, locality, subjects_needed, subjects_required, parent_name, parent_phone, parent_whatsapp, enrollment_status")
      .order("full_name"),
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={
            preSelectedStudentId
              ? `/admin/students/${preSelectedStudentId}`
              : preSelectedTeacherId
              ? `/admin/teachers/${preSelectedTeacherId}`
              : "/admin/assignments"
          }
          className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Create Assignment</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Assign a qualified tutor to an active student or demo request.
          </p>
        </div>
      </div>

      <AssignmentCreationForm
        teachers={teachers || []}
        students={students || []}
        preSelectedTeacherId={preSelectedTeacherId}
        preSelectedStudentId={preSelectedStudentId}
      />
    </div>
  );
}
