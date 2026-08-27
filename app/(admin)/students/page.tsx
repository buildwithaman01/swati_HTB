import { createAdminClient } from "@/utils/supabase/server";
import { Search, MoreVertical, GraduationCap } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminStudents() {
  const supabase = await createAdminClient();
  
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("students").update({ enrollment_status: status }).eq("id", id);
    revalidatePath("/admin/students");
  }

  const STATUS_COLORS: Record<string, string> = {
    enquiry: "bg-purple-100 text-purple-700",
    demo: "bg-amber-100 text-amber-700",
    enrolled: "bg-emerald-100 text-emerald-700",
    paused: "bg-gray-100 text-gray-700",
    dropped: "bg-red-100 text-red-700"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Students</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Parent Contact</th>
              <th className="px-6 py-4 font-semibold">Class/Board</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {students?.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {s.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2937] text-sm">{s.full_name}</p>
                      <p className="text-xs text-neutral-500">{s.student_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-[#1F2937]">{s.parent_name}</p>
                  <p className="text-xs text-neutral-500">{s.parent_phone}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-[#1F2937]">{s.class_studying || "—"}</p>
                  <p className="text-xs text-neutral-500">{s.board || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[s.enrollment_status] || "bg-gray-100 text-gray-700"}`}>
                    {s.enrollment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={updateStatus} className="inline-flex gap-2">
                    <input type="hidden" name="id" value={s.id} />
                    <select name="status" onChange={(e) => e.target.form?.requestSubmit()} className="text-xs font-medium border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none">
                      <option value="" disabled selected>Update...</option>
                      <option value="enquiry">Enquiry</option>
                      <option value="demo">Demo</option>
                      <option value="enrolled">Enrolled</option>
                    </select>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!students || students.length === 0) && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium text-sm">No students found.</p>
          </div>
        )}
      </div>
    </div>
  );
}