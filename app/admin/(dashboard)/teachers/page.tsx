import { createAdminClient } from "@/utils/supabase/server";
import { CheckCircle2, XCircle, Search, MoreVertical } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminTeachers() {
  const supabase = await createAdminClient();
  
  const { data: teachers } = await supabase
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });

  // Server Action to approve teacher
  async function approveTeacher(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("teachers").update({ verification_status: "approved", badge_level: "verified", is_active: true }).eq("id", id);
    revalidatePath("/admin/teachers");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Teachers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input type="text" placeholder="Search teachers..." className="pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-4 font-semibold">Teacher</th>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {teachers?.map((t) => (
              <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-sm">
                      {t.profile_photo_url ? <img src={t.profile_photo_url} className="w-full h-full rounded-full object-cover"/> : t.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2937] text-sm">{t.full_name}</p>
                      <p className="text-xs text-neutral-500">{t.qualification}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-[#0F4C5C] font-semibold">{t.teacher_id}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">{t.locality || "—"}</td>
                <td className="px-6 py-4">
                  {t.verification_status === "approved" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : t.verification_status === "pending" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {t.verification_status === "pending" && (
                      <form action={approveTeacher}>
                        <input type="hidden" name="id" value={t.id} />
                        <button className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200">
                          Approve
                        </button>
                      </form>
                    )}
                    <Link href={`/teacher/${t.profile_slug}`} target="_blank" className="text-xs font-bold text-[#0F4C5C] hover:bg-[#0F4C5C]/5 px-3 py-1.5 rounded-lg transition-colors border border-[#0F4C5C]/20">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}