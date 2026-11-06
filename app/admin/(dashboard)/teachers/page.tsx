import { createAdminClient } from "@/utils/supabase/server";
import { CheckCircle2, XCircle, Search, MoreVertical, Plus, Filter, UserCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTeachers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const q = sp?.q;
  const status = sp?.status;

  const supabase = await createAdminClient();
  
  let query = supabase.from("teachers").select("*").order("created_at", { ascending: false });

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,teacher_id.ilike.%${q}%,phone.ilike.%${q}%,locality.ilike.%${q}%`);
  }

  if (status && status !== "all") {
    query = query.eq("verification_status", status);
  }

  const { data: teachers } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Teachers</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage teacher profiles and verification</p>
        </div>
        <Link href="/admin/teachers/new" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> Add Teacher
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200/60 flex flex-col sm:flex-row gap-4">
        <form className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search by name, ID, phone, or area..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 text-sm" 
            />
          </div>
          {status && <input type="hidden" name="status" value={status} />}
          <button type="submit" className="bg-neutral-100 hover:bg-neutral-200 text-[#1F2937] px-4 rounded-xl text-sm font-semibold transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="text-neutral-400 w-4 h-4 ml-2" />
          <div className="flex bg-neutral-100 p-1 rounded-xl">
            <FilterLink current={status} value="" label="All" q={q} />
            <FilterLink current={status} value="pending" label="Pending" q={q} />
            <FilterLink current={status} value="approved" label="Approved" q={q} />
            <FilterLink current={status} value="rejected" label="Rejected" q={q} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-4 font-semibold">Teacher</th>
              <th className="px-6 py-4 font-semibold">Contact & Area</th>
              <th className="px-6 py-4 font-semibold">Badge & Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {teachers?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  <ShieldAlert className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                  <p className="font-medium text-sm">No teachers found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              teachers?.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {t.profile_photo_url ? <img src={t.profile_photo_url} alt="" className="w-full h-full rounded-full object-cover"/> : (t.full_name || "T").charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1F2937] text-sm">{t.full_name}</p>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{t.teacher_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#1F2937]">{t.phone}</p>
                    <p className="text-xs text-neutral-500 truncate max-w-[200px]">{t.locality || "Area not specified"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      {t.verification_status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : t.verification_status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      
                      {t.badge_level !== 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider border border-indigo-100">
                          {t.badge_level}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/teachers/${t.id}`} className="inline-flex items-center gap-2 text-xs font-bold bg-white text-[#1F2937] hover:bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                      <UserCheck className="w-3.5 h-3.5" /> Review & Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterLink({ current, value, label, q }: { current?: string; value: string; label: string; q?: string }) {
  const isActive = (current === value) || (!current && value === "");
  const params = new URLSearchParams();
  if (value) params.set("status", value);
  if (q) params.set("q", q);
  
  const href = `/admin/teachers${params.toString() ? `?${params.toString()}` : ""}`;
  
  return (
    <Link 
      href={href}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        isActive 
          ? "bg-white text-[#1F2937] shadow-sm border border-neutral-200/60" 
          : "text-neutral-500 hover:text-[#1F2937] hover:bg-neutral-200/50"
      }`}
    >
      {label}
    </Link>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}