import { createAdminClient } from "@/utils/supabase/server";
import { Search, GraduationCap, Plus, Filter, UserCheck, AlertCircle, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminStudents({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const q = sp?.q;
  const status = sp?.status;

  const supabase = await createAdminClient();
  
  let query = supabase.from("students").select("*").order("created_at", { ascending: false });

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,student_id.ilike.%${q}%,parent_phone.ilike.%${q}%,locality.ilike.%${q}%`);
  }

  if (status && status !== "all") {
    query = query.eq("enrollment_status", status);
  }

  const { data: students } = await query;

  const STATUS_COLORS: Record<string, string> = {
    enquiry: "bg-purple-100 text-purple-700 border-purple-200",
    demo: "bg-amber-100 text-amber-700 border-amber-200",
    enrolled: "bg-emerald-100 text-emerald-700 border-emerald-200",
    paused: "bg-gray-100 text-gray-700 border-gray-200",
    dropped: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Students</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage students, enquiries, and active enrollments</p>
        </div>
        <Link href="/admin/students/new" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> Add Student
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
              placeholder="Search by name, ID, parent phone, or area..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 text-sm" 
            />
          </div>
          {status && <input type="hidden" name="status" value={status} />}
          <button type="submit" className="bg-neutral-100 hover:bg-neutral-200 text-[#1F2937] px-4 rounded-xl text-sm font-semibold transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="text-neutral-400 w-4 h-4 ml-2 shrink-0" />
          <div className="flex bg-neutral-100 p-1 rounded-xl shrink-0">
            <FilterLink current={status} value="" label="All" q={q} />
            <FilterLink current={status} value="enquiry" label="Enquiry" q={q} />
            <FilterLink current={status} value="demo" label="Demo" q={q} />
            <FilterLink current={status} value="enrolled" label="Enrolled" q={q} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Parent & Contact</th>
              <th className="px-6 py-4 font-semibold">Academic</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {(!students || students.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  <AlertCircle className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                  <p className="font-medium text-sm">No students found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const subjects = (s.subjects_required && s.subjects_required.length > 0)
                  ? s.subjects_required
                  : (s.subjects_needed && s.subjects_needed.length > 0)
                  ? s.subjects_needed
                  : [];
                const formattedClass = s.class_studying
                  ? (s.class_studying.toLowerCase().startsWith("class") ? s.class_studying : `Class ${s.class_studying}`)
                  : "Class not set";
                const phoneClean = (s.whatsapp || s.parent_phone || "").replace(/\D/g, "");

                return (
                  <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {(s.full_name || "S").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1F2937] text-sm">{s.full_name || "Student Lead"}</p>
                          <p className="text-xs text-neutral-500 font-mono mt-0.5">{s.student_id || "STD-PENDING"}</p>
                          {s.created_at && (
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {new Date(s.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#1F2937]">{s.parent_name || s.full_name || "Parent"}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-neutral-500">{s.parent_phone || "No phone"}</span>
                        {phoneClean && (
                          <a
                            href={`https://wa.me/${phoneClean.startsWith("91") ? phoneClean : `91${phoneClean}`}?text=${encodeURIComponent(`Hello ${s.parent_name || ""}, I am contacting you from Swati Home Tuition Bureau regarding your enquiry for ${formattedClass}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] hover:text-[#1eb856] p-0.5 inline-flex items-center"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[170px]">
                        📍 {s.locality || "Patna"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#1F2937]">{formattedClass}</p>
                      {subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[240px]">
                          {subjects.slice(0, 3).map((sub: string, idx: number) => (
                            <span key={idx} className="bg-neutral-100 text-neutral-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                              {sub}
                            </span>
                          ))}
                          {subjects.length > 3 && (
                            <span className="text-[10px] text-neutral-400 font-medium self-center">
                              +{subjects.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400 mt-0.5">{s.board || "CBSE"}</p>
                      )}
                      {s.internal_notes && (
                        <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1 max-w-[240px] italic">
                          📝 {s.internal_notes}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[s.enrollment_status] || "bg-gray-100 text-gray-700"}`}>
                        {s.enrollment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/students/${s.id}`} className="inline-flex items-center gap-2 text-xs font-bold bg-white text-[#1F2937] hover:bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                        <UserCheck className="w-3.5 h-3.5" /> Details
                      </Link>
                    </td>
                  </tr>
                );
              })
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
  
  const href = `/admin/students${params.toString() ? `?${params.toString()}` : ""}`;
  
  return (
    <Link 
      href={href}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
        isActive 
          ? "bg-white text-[#1F2937] shadow-sm border border-neutral-200/60" 
          : "text-neutral-500 hover:text-[#1F2937] hover:bg-neutral-200/50"
      }`}
    >
      {label}
    </Link>
  );
}