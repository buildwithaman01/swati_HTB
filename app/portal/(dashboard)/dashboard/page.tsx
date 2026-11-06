import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, IndianRupee, BookOpen, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { ParentGoogleReviewCard } from "@/components/promotions/PromotionBanners";
import RateTutorButton from "../RateTutorButton";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, class_studying, board, parent_name, enrollment_status")
    .or(`parent_email.eq.${user.email},email.eq.${user.email},parent_auth_user_id.eq.${user.id}`)
    .single();

  if (!student) redirect("/portal/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const { data: assignmentsForReports } = await supabase
    .from("assignments")
    .select("id")
    .eq("student_id", student.id);
  const assignmentIds = assignmentsForReports?.map(a => a.id) || [];

  const [{ data: assignment }, { data: sessions }, { data: reports }, { data: payments }] = await Promise.all([
    supabase.from("assignments").select(`*, teacher:teacher_id(full_name, badge_level)`).eq("student_id", student.id).eq("status", "active").single(),
    supabase.from("sessions").select("*").eq("student_id", student.id).gte("session_date", startOfMonth),
    supabase.from("progress_reports").select("*").in("assignment_id", assignmentIds).eq("sent_to_parent", true).order("created_at", { ascending: false }).limit(1),
    supabase.from("payments").select("*").eq("student_id", student.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const completedSessions = sessions?.filter(s => s.status === "completed").length || 0;
  const totalSessions = sessions?.length || 0;
  const latestReport = reports?.[0];
  const latestPayment = payments?.[0];
  const teacher = assignment?.teacher as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Hello, {student.parent_name}!</h1>
        <p className="text-sm text-neutral-500 mt-1">Here's {student.full_name}'s tuition summary for this month.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">{completedSessions}<span className="text-sm font-normal text-neutral-400">/{totalSessions}</span></p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Sessions This Month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">{totalSessions > 0 ? Math.round(completedSessions / totalSessions * 100) : 100}%</p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Attendance Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">₹{assignment ? Number(assignment.monthly_fee).toLocaleString("en-IN") : "—"}</p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Monthly Fee</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          {latestPayment ? (
            <>
              <div className={`w-8 h-8 ${latestPayment.status === "received" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"} rounded-xl flex items-center justify-center mb-3`}>
                {latestPayment.status === "received" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <p className={`text-sm font-bold capitalize ${latestPayment.status === "received" ? "text-emerald-600" : "text-red-600"}`}>{latestPayment.status}</p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">{latestPayment.payment_month} Payment</p>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center mb-3">
                <IndianRupee className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-sm font-bold text-neutral-400">No record</p>
              <p className="text-xs text-neutral-500 mt-1">Payment Status</p>
            </>
          )}
        </div>
      </div>

      {/* Rate Us on Google & Social Promotion */}
      <ParentGoogleReviewCard />

      {/* Current Teacher */}
      {assignment && teacher && (
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Current Teacher
            </h2>
            <RateTutorButton
              assignmentId={assignment.id}
              teacherName={teacher.full_name}
              subject={assignment.subject}
              variant="button"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0F4C5C] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {teacher.full_name?.charAt(0) || "T"}
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] text-lg">{teacher.full_name}</h3>
              <p className="text-sm text-neutral-500">{assignment.subject} · {assignment.classes_per_week}x/week · {assignment.session_duration_mins} min</p>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                teacher.badge_level === "elite" ? "bg-amber-100 text-amber-700" :
                teacher.badge_level === "certified" ? "bg-blue-100 text-blue-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {teacher.badge_level === "elite" ? "🏆 Elite" : teacher.badge_level === "certified" ? "⭐ Certified" : "✅ Verified"} Teacher
              </span>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-neutral-600">Schedule</p>
              <p className="text-xs text-neutral-400 mt-1">{(assignment.session_days || []).join(", ") || "TBD"}</p>
              <p className="text-xs text-neutral-400">{assignment.session_time ? `at ${assignment.session_time}` : ""}</p>
            </div>
          </div>
          <RateTutorButton
            assignmentId={assignment.id}
            teacherName={teacher.full_name}
            subject={assignment.subject}
            variant="card"
          />
        </div>
      )}

      {/* Latest Progress Report */}
      {latestReport && (
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wide mb-4">Latest Progress Report — {latestReport.report_month}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {latestReport.test_score_before != null && (
              <div className="text-center p-3 bg-neutral-50 rounded-xl">
                <p className="text-2xl font-bold text-neutral-600">{latestReport.test_score_before}%</p>
                <p className="text-xs text-neutral-400 mt-1">Score Before</p>
              </div>
            )}
            {latestReport.test_score_after != null && (
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{latestReport.test_score_after}%</p>
                <p className="text-xs text-neutral-400 mt-1">Score After</p>
              </div>
            )}
          </div>
          {latestReport.tutor_message && (
            <div className="bg-[#0F4C5C]/5 rounded-xl p-4">
              <p className="text-xs font-bold text-[#0F4C5C] mb-1">Message from Teacher</p>
              <p className="text-sm text-neutral-700 italic">"{latestReport.tutor_message}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}