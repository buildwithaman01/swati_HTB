import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  IndianRupee,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Sparkles,
  Headphones,
} from "lucide-react";
import { ParentGoogleReviewCard } from "@/components/promotions/PromotionBanners";
import RateTutorButton from "../RateTutorButton";
import { CANONICAL_LINKS } from "@/lib/constants";
import { formatWhatsAppUrl, formatSupportWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const adminClient = await createAdminClient();

  const { data: student } = await adminClient
    .from("students")
    .select("id, full_name, class_studying, board, parent_name, locality, enrollment_status")
    .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  // Fetch all assignments with full teacher details
  const { data: assignments } = await adminClient
    .from("assignments")
    .select(`
      id, subject, classes_per_week, session_duration_mins, session_days, session_time, monthly_fee, status,
      teacher:teachers(
        id, full_name, phone, whatsapp, qualification, institution, experience_years,
        locality, badge_level, rating_average, total_reviews, police_verified, profile_photo_url
      )
    `)
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  const allAssignments = assignments || [];
  const activeAssignments = allAssignments.filter((a) => a.status === "active");
  const assignmentIds = allAssignments.map((a) => a.id);

  // Fetch sessions, latest report, and latest payment
  let reportQuery = adminClient
    .from("progress_reports")
    .select("*")
    .eq("sent_to_parent", true);

  if (assignmentIds.length > 0) {
    reportQuery = reportQuery.or(`student_id.eq.${student.id},assignment_id.in.(${assignmentIds.join(",")})`);
  } else {
    reportQuery = reportQuery.or(`student_id.eq.${student.id}`);
  }

  const [{ data: sessions }, { data: reports }, { data: payments }] = await Promise.all([
    adminClient.from("sessions").select("*").eq("student_id", student.id).gte("session_date", startOfMonth),
    reportQuery.order("created_at", { ascending: false }).limit(1),
    adminClient.from("payments").select("*").eq("student_id", student.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const completedSessions = sessions?.filter((s) => s.status === "completed" || s.status === "logged").length || 0;
  const totalSessions = sessions?.length || 0;
  const latestReport = reports?.[0];
  const latestPayment = payments?.[0];

  const totalMonthlyFee = activeAssignments.reduce((acc, a) => acc + (Number(a.monthly_fee) || 0), 0);

  const supportWhatsAppUrl = formatSupportWhatsAppUrl(
    `Hello Swati HTB, I am ${student.parent_name} (Parent of ${student.full_name}, Class ${student.class_studying || ""}). I need assistance with our tuition classes.`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F2937]">
            Hello, {student.parent_name}!
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Here is {student.full_name}&apos;s tuition summary, assigned educators, and attendance for this month.
          </p>
        </div>

        <a
          href={supportWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1e8a45] border border-[#25D366]/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Bureau Helpdesk</span>
        </a>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/portal/sessions" className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm hover:border-[#0F4C5C]/40 transition-colors block">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">
            {completedSessions}
            <span className="text-sm font-normal text-neutral-400">/{totalSessions}</span>
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Sessions This Month</p>
        </Link>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">
            {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 100}%
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Attendance Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1F2937]">
            {totalMonthlyFee > 0 ? `₹${totalMonthlyFee.toLocaleString("en-IN")}` : "—"}
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Monthly Tuition Fee</p>
        </div>

        <Link href="/portal/payments" className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm hover:border-[#0F4C5C]/40 transition-colors block">
          {latestPayment ? (
            <>
              <div
                className={`w-8 h-8 ${
                  latestPayment.status === "received" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                } rounded-xl flex items-center justify-center mb-3`}
              >
                {latestPayment.status === "received" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <p
                className={`text-sm font-bold capitalize ${
                  latestPayment.status === "received" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {latestPayment.status === "received" ? "Fee Paid" : latestPayment.status}
              </p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">{latestPayment.payment_month} Record</p>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center mb-3">
                <IndianRupee className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-sm font-bold text-neutral-400">View History</p>
              <p className="text-xs text-neutral-500 mt-1">Payment Status</p>
            </>
          )}
        </Link>
      </div>

      {/* Rate Us on Google & Social Promotion */}
      <ParentGoogleReviewCard />

      {/* Assigned Teachers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-[#1F2937] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0F4C5C]" /> Assigned Home Tutors & Faculty
          </h2>
          {activeAssignments.length > 0 && (
            <span className="text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold px-2.5 py-1 rounded-full">
              {activeAssignments.length} Active {activeAssignments.length === 1 ? "Subject" : "Subjects"}
            </span>
          )}
        </div>

        {activeAssignments.length > 0 ? (
          <div className="space-y-4">
            {activeAssignments.map((assignment) => {
              const teacher = assignment.teacher as any;
              if (!teacher) return null;

              const teacherWhatsApp = formatWhatsAppUrl(
                teacher.whatsapp || teacher.phone,
                `Hello ${teacher.full_name}, I am ${student.parent_name} (Parent of ${student.full_name}). Reaching out regarding our ${assignment.subject} tuition.`
              );

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-3xl border border-neutral-200/70 shadow-sm p-6 hover:shadow-md transition-shadow space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Teacher Details */}
                    <div className="flex items-start gap-4">
                      {teacher.profile_photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacher.profile_photo_url}
                          alt={teacher.full_name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0F4C5C] to-[#082830] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm shrink-0">
                          {teacher.full_name?.charAt(0) || "T"}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              teacher.badge_level === "elite"
                                ? "bg-amber-100 text-amber-800"
                                : teacher.badge_level === "certified"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {teacher.badge_level === "elite"
                              ? "🏆 Elite Educator"
                              : teacher.badge_level === "certified"
                              ? "⭐ Certified Educator"
                              : "✅ Verified Educator"}
                          </span>

                          {teacher.police_verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Police Verified
                            </span>
                          )}

                          {teacher.rating_average && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#855e05] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Star className="w-3.5 h-3.5 fill-[#D4A017] text-[#D4A017]" />
                              {Number(teacher.rating_average).toFixed(1)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-[#1F2937] text-lg sm:text-xl">
                          {teacher.full_name}
                        </h3>

                        <p className="text-xs text-neutral-600 font-medium">
                          Subject: <strong className="text-[#0F4C5C]">{assignment.subject}</strong> · {assignment.classes_per_week || 3}x/week · {assignment.session_duration_mins || 60} mins
                        </p>

                        {(teacher.qualification || teacher.institution) && (
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>
                              {teacher.qualification}
                              {teacher.institution ? ` (${teacher.institution})` : ""}
                              {teacher.experience_years ? ` • ${teacher.experience_years}+ yrs exp` : ""}
                            </span>
                          </p>
                        )}

                        {teacher.locality && (
                          <p className="text-xs text-neutral-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0F4C5C] shrink-0" />
                            <span>Locality: {teacher.locality}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Schedule Block */}
                    <div className="bg-[#FAF7F2] border border-[#E8E6DF] rounded-2xl p-3.5 sm:text-right shrink-0 min-w-[180px]">
                      <p className="text-xs font-bold text-[#0B192C] uppercase tracking-wider flex sm:justify-end items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0F4C5C]" /> Class Timings
                      </p>
                      <p className="text-xs font-semibold text-[#1F2937] mt-1">
                        {(assignment.session_days || []).join(", ") || "Mon, Wed, Fri"}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {assignment.session_time ? `at ${assignment.session_time}` : "Scheduled by mutual agreement"}
                      </p>
                      <p className="text-xs font-bold text-emerald-700 mt-2">
                        ₹{Number(assignment.monthly_fee || 0).toLocaleString("en-IN")}/mo
                      </p>
                    </div>
                  </div>

                  {/* Contact & Review Action Bar */}
                  <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {teacher.phone && (
                        <a
                          href={`tel:${teacher.phone}`}
                          className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#0F4C5C]" />
                          <span>Call Tutor</span>
                        </a>
                      )}

                      {(teacher.whatsapp || teacher.phone) && (
                        <a
                          href={teacherWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1e8a45] border border-[#25D366]/30 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>WhatsApp Tutor</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <RateTutorButton
                        assignmentId={assignment.id}
                        teacherName={teacher.full_name}
                        subject={assignment.subject}
                        variant="button"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Reassuring State when Matching is in Progress */
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-2xl flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-lg font-bold text-[#1F2937] font-serif">
                Tutor Allotment In Progress
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our academic coordinator is currently matching verified educators tailored to {student.full_name}&apos;s syllabus and your locality ({student.locality || "Patna"}).
              </p>
            </div>
            <div className="pt-2">
              <a
                href={supportWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#0a3a47] text-white text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Inquire With Academic Coordinator</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Latest Progress Report */}
      {latestReport && (
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wide">
              Latest Progress Report — {latestReport.report_month || "Recent Assessment"}
            </h2>
            <Link
              href="/portal/reports"
              className="text-xs font-bold text-[#0F4C5C] hover:underline"
            >
              View All Reports →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            {latestReport.test_scores && (
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-700">{latestReport.test_scores}</p>
                <p className="text-xs text-neutral-400 mt-1">Topic Test Score</p>
              </div>
            )}
          </div>

          {latestReport.tutor_message && (
            <div className="bg-[#0F4C5C]/5 rounded-xl p-4 border border-[#0F4C5C]/10">
              <p className="text-xs font-bold text-[#0F4C5C] mb-1">Message from Educator</p>
              <p className="text-sm text-neutral-700 italic">&ldquo;{latestReport.tutor_message}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {/* Bureau Parent Helpline Card */}
      <div className="bg-gradient-to-r from-[#0F4C5C] to-[#0A333E] rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Headphones className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Dedicated Parent Support</span>
          </div>
          <h3 className="text-xl font-bold font-serif">
            Need to reschedule a class or request an extra doubt session?
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Our bureau academic coordinators are available 7 days a week to ensure your child receives uninterrupted, high-quality tuition.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <a
            href={supportWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Coordinator</span>
          </a>
          <a
            href={`tel:${CANONICAL_LINKS.phone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{CANONICAL_LINKS.displayPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
