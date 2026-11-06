import { createAdminClient } from "@/utils/supabase/server";
import { CheckCircle2, XCircle, Search, Plus, Filter, ShieldAlert, Clock, PauseCircle, UserMinus } from "lucide-react";
import Link from "next/link";
import TeacherRowActions from "./TeacherRowActions";
import TutorAnnouncementButton from "./TutorAnnouncementButton";

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

  const renderStatusBadge = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case "on_leave":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
            <PauseCircle className="w-3 h-3 text-purple-600" /> On Leave
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-150 text-neutral-700 text-xs font-bold border border-neutral-300">
            <UserMinus className="w-3 h-3 text-neutral-500" /> Inactive
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
            {verificationStatus}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0B192C]">Teachers &amp; Educators</h1>
          <p className="text-sm text-neutral-500 mt-1 font-sans">Manage educator vetting, active associations, leave breaks, and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <TutorAnnouncementButton />
          <Link 
            href="/admin/teachers/new" 
            className="bg-[#0B192C] hover:bg-[#1E3E62] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm border-b-[2px] border-[#E5A93C]"
          >
            <Plus size={18} className="text-[#E5A93C]" /> Add Educator Profile
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E8E6DF] flex flex-col lg:flex-row gap-4 font-sans">
        <form className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search by teacher name, ID, phone, or neighborhood..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E6DF] focus:outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-sm" 
            />
          </div>
          {status && <input type="hidden" name="status" value={status} />}
          <button type="submit" className="bg-neutral-100 hover:bg-neutral-200 text-[#0B192C] px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <Filter className="text-neutral-400 w-4 h-4 ml-1 shrink-0" />
          <div className="flex bg-neutral-100 p-1 rounded-xl shrink-0 gap-0.5">
            <FilterLink current={status} value="" label="All" q={q} />
            <FilterLink current={status} value="pending" label="Pending" q={q} />
            <FilterLink current={status} value="approved" label="Approved" q={q} />
            <FilterLink current={status} value="on_leave" label="On Leave" q={q} />
            <FilterLink current={status} value="inactive" label="Inactive" q={q} />
            <FilterLink current={status} value="rejected" label="Rejected" q={q} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6DF] overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F8F5] border-b border-[#E8E6DF] text-xs uppercase tracking-wider text-[#5A6578]">
                <th className="px-6 py-4 font-bold">Educator</th>
                <th className="px-6 py-4 font-bold">Contact &amp; Neighborhood</th>
                <th className="px-6 py-4 font-bold">Status &amp; Badge</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {teachers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <ShieldAlert className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-semibold text-sm text-[#0B192C]">No educators found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                teachers?.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F9F8F5]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0B192C] text-[#E5A93C] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                          {t.profile_photo_url ? (
                            <img src={t.profile_photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (t.full_name || "T").charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#0B192C] text-sm">{t.full_name}</p>
                          <p className="text-xs text-[#5A6578] font-mono mt-0.5">{t.teacher_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#0B192C]">{t.phone || "No phone"}</p>
                      <p className="text-xs text-[#5A6578] truncate max-w-[200px]">📍 {t.locality || "Patna"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {renderStatusBadge(t.verification_status)}
                        
                        {t.badge_level && t.badge_level !== 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F3F1EC] text-[#1E3E62] text-[10px] uppercase font-bold tracking-wider border border-[#E8E6DF]">
                            {t.badge_level}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <TeacherRowActions
                        teacherId={t.id}
                        teacherName={t.full_name || "Educator"}
                        currentStatus={t.verification_status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
        isActive 
          ? "bg-white text-[#0B192C] shadow-2xs border border-[#E8E6DF]" 
          : "text-[#5A6578] hover:text-[#0B192C] hover:bg-neutral-200/50"
      }`}
    >
      {label}
    </Link>
  );
}
