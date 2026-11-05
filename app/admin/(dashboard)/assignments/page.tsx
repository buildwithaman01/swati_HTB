import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BookOpen, Plus, Users, ChevronRight, IndianRupee, Clock, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import Link from "next/link";
import AssignmentActions from "./AssignmentActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAssignments() {
  const supabase = await createAdminClient();

  const [{ data: assignments }, { data: teachers }, { data: students }] = await Promise.all([
    supabase
      .from("assignments")
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id, locality, subjects),
        student:students(id, full_name, student_id, class_studying, board, parent_name, parent_phone)
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("teachers")
      .select("id, full_name, teacher_id, locality, subjects, verification_status")
      .eq("verification_status", "approved")
      .eq("is_active", true)
      .order("full_name"),
    supabase
      .from("students")
      .select("id, full_name, student_id, class_studying, subjects_needed, locality, parent_name")
      .in("enrollment_status", ["demo", "enrolled", "enquiry"])
      .order("full_name"),
  ]);

  async function createAssignment(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();

    const monthlyFee = parseFloat(formData.get("monthly_fee") as string);
    const commissionPct = 25;

    await adminSupabase.from("assignments").insert({
      teacher_id: formData.get("teacher_id"),
      student_id: formData.get("student_id"),
      subject: formData.get("subject"),
      classes_per_week: parseInt(formData.get("classes_per_week") as string) || 3,
      session_duration_mins: parseInt(formData.get("session_duration_mins") as string) || 60,
      session_days: (formData.get("session_days") as string)?.split(",").map(d => d.trim()).filter(Boolean),
      session_time: formData.get("session_time") || null,
      monthly_fee: monthlyFee,
      bureau_commission_pct: commissionPct,
      start_date: formData.get("start_date") || null,
      notes: formData.get("notes") || null,
      status: "active",
    });

    // Also mark student as enrolled
    await adminSupabase
      .from("students")
      .update({ enrollment_status: "enrolled" })
      .eq("id", formData.get("student_id"));

    revalidatePath("/admin/assignments");
  }

  async function updateAssignmentStatus(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    await adminSupabase
      .from("assignments")
      .update({
        status: formData.get("status"),
        cancellation_reason: formData.get("reason") || null,
      })
      .eq("id", formData.get("id"));
    revalidatePath("/admin/assignments");
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
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Plus size={18} className="text-[#0F4C5C]" />
          <h2 className="font-bold text-[#1F2937] text-lg">Create New Assignment</h2>
        </div>
        <form action={createAssignment} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Teacher Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Teacher *</label>
            <select name="teacher_id" required className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              <option value="">Select teacher...</option>
              {teachers?.map(t => (
                <option key={t.id} value={t.id}>{t.full_name} ({t.teacher_id}) — {t.locality || "?"}</option>
              ))}
            </select>
          </div>

          {/* Student Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Student *</label>
            <select name="student_id" required className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              <option value="">Select student...</option>
              {students?.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.student_id}) — Class {s.class_studying || "?"}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Subject *</label>
            <input name="subject" required placeholder="e.g. Mathematics" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Monthly Fee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Monthly Fee (₹) *</label>
            <input name="monthly_fee" type="number" required placeholder="e.g. 6000" min="0" step="100" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Classes per week */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Classes / Week</label>
            <select name="classes_per_week" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} days/week</option>)}
            </select>
          </div>

          {/* Session Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Duration (mins)</label>
            <select name="session_duration_mins" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              <option value="45">45 min</option>
              <option value="60" selected>60 min (1 hr)</option>
              <option value="90">90 min (1.5 hr)</option>
              <option value="120">120 min (2 hr)</option>
            </select>
          </div>

          {/* Session Days */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Session Days</label>
            <input name="session_days" placeholder="Mon, Wed, Fri" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Session Time */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Session Time</label>
            <input name="session_time" type="time" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Start Date</label>
            <input name="start_date" type="date" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Notes (optional)</label>
            <textarea name="notes" rows={2} placeholder="Any special instructions..." className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 resize-none" />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 lg:col-span-3 flex items-center gap-3">
            <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2">
              <Plus size={16} /> Create Assignment
            </button>
            <p className="text-xs text-neutral-400">Commission (25%) and teacher earning are auto-calculated</p>
          </div>
        </form>
      </div>

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
