import { createAdminClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, User, Phone, MapPin, GraduationCap, FileText, Save, Home, BookOpen, AlertCircle, Calendar, MessageCircle } from "lucide-react";
import StudentAccountManagementCard from "./StudentAccountManagementCard";

export default async function StudentDetail({ params }: { params: { id: string } }) {
  const supabase = await createAdminClient();
  
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!student) return notFound();

  // Fetch their assignments to show active teachers/classes
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      *,
      teachers:teacher_id (
        full_name,
        phone
      )
    `)
    .eq("student_id", student.id);

  // Fetch payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  // Fetch sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, teachers:teacher_id(full_name)")
    .eq("student_id", student.id)
    .order("session_date", { ascending: false })
    .limit(20);

  // Check if auth user exists
  let authUserId = null;
  const targetEmail = student.parent_email || student.email;
  if (targetEmail) {
    const { data: authData } = await supabase.auth.admin.listUsers();
    const user = authData.users.find((u) => u.email === targetEmail);
    if (user) authUserId = user.id;
  }

  async function updateStudentStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;
    
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("students").update({ 
      enrollment_status: status,
      internal_notes: notes || null
    }).eq("id", id);
    
    revalidatePath(`/admin/students/${id}`);
    revalidatePath(`/admin/students`);
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const adminSupabase = await createAdminClient();
    
    await adminSupabase.from("students").update({
      full_name: formData.get("full_name"),
      parent_name: formData.get("parent_name"),
      parent_phone: formData.get("parent_phone"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
      locality: formData.get("locality"),
      address: formData.get("address"),
      class_studying: formData.get("class_studying"),
      board: formData.get("board"),
      subjects_required: (formData.get("subjects_required") as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      tuition_type_preference: formData.get("tuition_type_preference"),
      budget_range: formData.get("budget_range")
    }).eq("id", id);
    
    revalidatePath(`/admin/students/${id}`);
  }

  const STATUS_COLORS: Record<string, string> = {
    enquiry: "bg-purple-100 text-purple-700 border-purple-200",
    demo: "bg-amber-100 text-amber-700 border-amber-200",
    enrolled: "bg-emerald-100 text-emerald-700 border-emerald-200",
    paused: "bg-gray-100 text-gray-700 border-gray-200",
    dropped: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Student Profile</h1>
          <p className="text-sm text-neutral-500 font-mono mt-1">{student.student_id} · Registered {new Date(student.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Identity & Status */}
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl mb-4 shadow-sm border border-indigo-200">
              {student.full_name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-[#1F2937]">{student.full_name}</h2>
            <p className="text-sm text-neutral-500 mt-1">Class {student.class_studying} · {student.board}</p>
            
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[student.enrollment_status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                {student.enrollment_status}
              </span>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
            <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-2">Parent / Guardian</h3>
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-[#1F2937]">{student.parent_name}</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{student.parent_phone}</p>
                <p className="text-xs text-neutral-500">WhatsApp: {student.whatsapp || "Same"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{student.locality}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{student.address}</p>
              </div>
            </div>
          </div>

          <StudentAccountManagementCard 
            studentId={student.id}
            studentName={student.full_name}
            parentEmail={student.parent_email || student.email || ""}
            parentPhone={student.parent_whatsapp || student.parent_phone || ""}
            authUserId={authUserId}
          />

          {/* Status Box */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Enrollment Status
            </h3>
            
            <form action={updateStudentStatus} className="space-y-4">
              <input type="hidden" name="id" value={student.id} />
              
              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Status</label>
                <select name="status" defaultValue={student.enrollment_status} className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white">
                  <option value="enquiry">Enquiry</option>
                  <option value="demo">Demo Scheduled / In Progress</option>
                  <option value="enrolled">Enrolled (Active tuition)</option>
                  <option value="paused">Paused / Break</option>
                  <option value="dropped">Dropped / Left</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 mb-1 block">Internal Notes / Requirements</label>
                <textarea 
                  name="notes" 
                  defaultValue={student.internal_notes || ""} 
                  placeholder="Notes about specific requirements, demo feedback..."
                  rows={4} 
                  className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#1F2937] text-white font-bold py-2.5 rounded-xl hover:bg-black transition-colors text-sm">
                Save Status
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Full Data Form */}
        <div className="lg:col-span-2 space-y-6">
          <form action={updateProfile} className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <input type="hidden" name="id" value={student.id} />
            <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0F4C5C]" /> Profile Data
              </h2>
              <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                <Save size={16} /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Personal */}
              <div className="md:col-span-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Student & Parent</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Student Full Name</label>
                <input name="full_name" defaultValue={student.full_name} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Parent / Guardian Name</label>
                <input name="parent_name" defaultValue={student.parent_name} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              
              {/* Contact & Location */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Contact & Location</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Parent Phone Number</label>
                <input name="parent_phone" defaultValue={student.parent_phone} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">WhatsApp</label>
                <input name="whatsapp" defaultValue={student.whatsapp || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Email</label>
                <input type="email" name="email" defaultValue={student.email || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Full Address</label>
                <textarea name="address" defaultValue={student.address || ""} rows={2} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Locality (Short)</label>
                <input name="locality" defaultValue={student.locality || ""} placeholder="e.g. Boring Road" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

              {/* Academic & Tuition Needs */}
              <div className="md:col-span-2 mt-2">
                <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-3">Academic & Tuition Needs</h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Class</label>
                <input name="class_studying" defaultValue={student.class_studying || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Board</label>
                <select name="board" defaultValue={student.board || ""} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="">Select Board...</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Subjects Required (comma-separated)</label>
                <input name="subjects_required" defaultValue={(student.subjects_required || []).join(", ")} placeholder="Maths, Science, English" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Tuition Preference</label>
                <select name="tuition_type_preference" defaultValue={student.tuition_type_preference || "home"} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="home">Home Tuition (Teacher comes home)</option>
                  <option value="online">Online Tuition</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Budget Range</label>
                <input name="budget_range" defaultValue={student.budget_range || ""} placeholder="e.g. 3000-5000/month" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

            </div>
          </form>

          {/* Active Assignments */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0F4C5C]" /> Assignments
              </h2>
              <Link href={`/admin/assignments/new?student_id=${student.id}`} className="text-xs font-bold text-[#0F4C5C] hover:underline">
                + New Assignment
              </Link>
            </div>
            
            {!assignments || assignments.length === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">No assignments found for this student.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border border-neutral-100 rounded-xl p-4 flex justify-between items-center bg-neutral-50/50 hover:bg-white transition-colors">
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2937]">{assignment.subject}</h4>
                      <p className="text-xs text-neutral-500 mt-1">Teacher: <span className="font-semibold text-neutral-700">{assignment.teachers?.full_name}</span></p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        assignment.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        assignment.status === 'paused' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {assignment.status}
                      </span>
                      <p className="text-xs font-semibold text-[#1F2937] mt-1">₹{assignment.monthly_fee}/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Financials & Payments */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <span className="text-[#0F4C5C]">₹</span> Payment History
              </h2>
              {student.parent_phone && (
                <a 
                  href={`https://wa.me/${student.parent_phone?.replace(/\D/g, "")}?text=${encodeURIComponent(`🔔 *Fee Reminder*\n\nDear Parent/Guardian of ${student.full_name},\n\nThis is a gentle reminder regarding the pending tuition fee for the current month.\n\nPlease clear the dues at your earliest convenience to ensure uninterrupted classes.\n\nThank you,\nSwati Home Tuition Bureau`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Send Reminder
                </a>
              )}
            </div>
            {!payments || payments.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No payments recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-2">Month</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Mode</th>
                      <th className="py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td className="py-2 font-semibold text-[#1F2937]">{p.payment_month}</td>
                        <td className="py-2">₹{p.amount}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2 text-neutral-500 capitalize">{p.payment_mode}</td>
                        <td className="py-2 text-right text-neutral-500">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-[#0F4C5C]" /> Recent Sessions (Last 20)
            </h2>
            {!sessions || sessions.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">No sessions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{new Date(s.session_date).toLocaleDateString("en-IN", { weekday: 'short', month: 'short', day: 'numeric'})}</p>
                      <p className="text-xs text-neutral-500">{s.teachers?.full_name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status.replace("_", " ")}
                      </span>
                      {s.duration_mins && <p className="text-xs text-neutral-500 mt-1">{s.duration_mins} mins</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
