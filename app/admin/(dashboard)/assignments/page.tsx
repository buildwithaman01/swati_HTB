import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BookOpen, Plus, Users, ChevronRight, IndianRupee, Clock, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import Link from "next/link";
import AssignmentActions from "./AssignmentActions";
import AssignmentCreationForm from "./new/AssignmentCreationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAssignments() {
  const supabase = await createAdminClient();

  const [{ data: assignments }, { data: teachers }, { data: students }] = await Promise.all([
    supabase
      .from("assignments")
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id, locality, subjects, phone, whatsapp),
        student:students(id, full_name, student_id, class_studying, board, parent_name, parent_phone, parent_whatsapp)
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("teachers")
      .select("id, full_name, teacher_id, locality, subjects, phone, whatsapp, verification_status")
      .order("full_name"),
    supabase
      .from("students")
      .select("id, full_name, student_id, class_studying, subjects_needed, subjects_required, locality, parent_name, parent_phone, parent_whatsapp, enrollment_status")
      .order("full_name"),
  ]);

  async function updateAssignmentStatus(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    await adminSupabase
      .from("assignments")
      .update({
        status: formData.get("status"),
        cancellation_reason: formData.get("reason") || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formData.get("id"));
    revalidatePath("/admin/assignments");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/finance");
  }

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    active: { label: "Active", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    paused: { label: "Paused", color: "bg-amber-100 text-amber-700", icon: <PauseCircle className="w-3.5 h-3.5" /> },
    completed: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3.5 h-3.5" /> },
  };

  const activeCount = assignments?.filter(a => a.status === "active").length ?? 0;
  const totalMonthlyRevenue = assignments
    ?.filter(a => a.status === "active")
    .reduce((sum, a) => sum + Number(a.monthly_fee), 0) ?? 0;
  const totalCommission = totalMonthlyRevenue * 0.25;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Assignments</h1>
          <p className="text-neutral-500 text-sm mt-1">Teacher ↔ Student links and fee management</p>
        </div>
        <Link
          href="/admin/assignments/new"
          className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Assignment
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600"><Users size={20} /></div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wide">Active Assignments</p>
            <p className="text-2xl font-bold text-[#1F2937]">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><IndianRupee size={20} /></div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wide">Monthly Revenue</p>
            <p className="text-2xl font-bold text-[#1F2937]">₹{totalMonthlyRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600"><IndianRupee size={20} /></div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wide">Bureau Commission (25%)</p>
            <p className="text-2xl font-bold text-[#1F2937]">₹{totalCommission.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Create Assignment Form */}
      <AssignmentCreationForm teachers={teachers || []} students={students || []} />

      {/* Assignments Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="font-bold text-[#1F2937] text-lg">All Assignments ({assignments?.length ?? 0})</h2>
        </div>

        {(!assignments || assignments.length === 0) ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium">No assignments yet. Create one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Teacher</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Schedule</th>
                  <th className="px-6 py-4 font-semibold">Fee / Earning</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assignments.map((a) => {
                  const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.active;
                  return (
                    <tr key={a.id} className="hover:bg-neutral-50/30 transition-colors">
                      {/* Teacher */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#1F2937]">{(a.teacher as any)?.full_name ?? "—"}</p>
                        <p className="text-xs text-neutral-400 font-mono">{(a.teacher as any)?.teacher_id}</p>
                      </td>
                      {/* Student */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#1F2937]">{(a.student as any)?.full_name ?? "—"}</p>
                        <p className="text-xs text-neutral-400">Parent: {(a.student as any)?.parent_name}</p>
                      </td>
                      {/* Subject */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#1F2937]">{a.subject}</p>
                        <p className="text-xs text-neutral-400">Class {(a.student as any)?.class_studying || "?"}</p>
                      </td>
                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#1F2937]">{a.classes_per_week}x/week</p>
                        <p className="text-xs text-neutral-400">{a.session_duration_mins} min</p>
                      </td>
                      {/* Fee */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#1F2937]">₹{Number(a.monthly_fee).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-emerald-600 font-medium">Teacher: ₹{Number(a.teacher_earning).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-purple-600">Bureau: ₹{Number(a.bureau_commission_amt).toLocaleString("en-IN")}</p>
                      </td>
                      {/* Status & Actions */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                        {a.start_date && (
                          <p className="text-xs text-neutral-400 mt-1">Since {new Date(a.start_date).toLocaleDateString("en-IN")}</p>
                        )}
                        <AssignmentActions
                          assignmentId={a.id}
                          teacherId={(a.teacher as any)?.id}
                          studentId={(a.student as any)?.id}
                          teacherName={(a.teacher as any)?.full_name}
                          parentName={(a.student as any)?.parent_name}
                          teacherPhone={(a.teacher as any)?.whatsapp || (a.teacher as any)?.phone}
                          parentPhone={(a.student as any)?.parent_whatsapp || (a.student as any)?.parent_phone}
                          subject={a.subject}
                        />
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <form action={updateAssignmentStatus} className="inline-flex gap-2 items-center">
                          <input type="hidden" name="id" value={a.id} />
                          <select
                            name="status"
                            defaultValue=""
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none"
                          >
                            <option value="" disabled>Change...</option>
                            <option value="active">Active</option>
                            <option value="paused">Pause</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
