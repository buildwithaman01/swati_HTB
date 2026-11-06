"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  MapPin,
  Phone,
  UserCircle,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  History,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { formatWhatsAppUrl, CANONICAL_SUPPORT_PHONE, CANONICAL_SUPPORT_PHONE_DISPLAY } from "@/lib/whatsapp";

export interface StudentInfo {
  id: string;
  student_id?: string;
  full_name: string;
  class_studying?: string | number;
  board?: string;
  locality?: string;
  address?: string;
  parent_name?: string;
  special_needs?: string;
  preferred_timing?: string;
}

export interface AssignmentItem {
  id: string;
  teacher_id?: string;
  student_id: string;
  subject?: string;
  status?: string;
  monthly_fee?: number;
  session_duration_mins?: number;
  classes_per_week?: number;
  session_days?: string[];
  session_time?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  students?: StudentInfo | null;
  student?: StudentInfo | null;
}

interface Props {
  assignments: AssignmentItem[];
}

export default function TeacherStudentsView({ assignments }: Props) {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [searchQuery, setSearchQuery] = useState("");

  const { activeList, pastList } = useMemo(() => {
    const active: AssignmentItem[] = [];
    const past: AssignmentItem[] = [];

    (assignments || []).forEach((asg) => {
      const s = (asg.status || "").toLowerCase().trim();
      if (s === "active" || s === "assigned" || s === "in_progress") {
        active.push(asg);
      } else {
        past.push(asg);
      }
    });

    return { activeList: active, pastList: past };
  }, [assignments]);

  const currentList = activeTab === "active" ? activeList : pastList;

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter((asg) => {
      const student = asg.students || asg.student;
      const name = (student?.full_name || "").toLowerCase();
      const subject = (asg.subject || "").toLowerCase();
      const locality = (student?.locality || "").toLowerCase();
      const cls = String(student?.class_studying || "").toLowerCase();
      const board = (student?.board || "").toLowerCase();
      return (
        name.includes(q) ||
        subject.includes(q) ||
        locality.includes(q) ||
        cls.includes(q) ||
        board.includes(q)
      );
    });
  }, [currentList, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#E8E6DF] shadow-xs">
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF]/80">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-[#5A6578] hover:text-[#0B192C] hover:bg-white/80"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeTab === "active" ? "bg-[#E5A93C] animate-pulse" : "bg-emerald-500"
              }`}
            />
            Active Tuitions
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "active"
                  ? "bg-white/20 text-white"
                  : "bg-[#E8E6DF] text-[#0B192C]"
              }`}
            >
              {activeList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "past"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-[#5A6578] hover:text-[#0B192C] hover:bg-white/80"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Past / Completed Tuitions
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "past"
                  ? "bg-white/20 text-white"
                  : "bg-[#E8E6DF] text-[#0B192C]"
              }`}
            >
              {pastList.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-[#5A6578] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, class, locality..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E6DF] rounded-xl outline-none focus:ring-2 focus:ring-[#0B192C]/20 bg-white text-[#0B192C] placeholder:text-[#5A6578]/60"
          />
        </div>
      </div>

      {/* Main Student Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-xs border border-[#E8E6DF] text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF] flex items-center justify-center mx-auto mb-4">
            {activeTab === "active" ? (
              <GraduationCap className="w-7 h-7 text-[#5A6578]/50" />
            ) : (
              <History className="w-7 h-7 text-[#5A6578]/50" />
            )}
          </div>
          <h3 className="text-lg font-bold font-serif text-[#0B192C]">
            {searchQuery
              ? "No matching tuitions found"
              : activeTab === "active"
              ? "No Active Tuitions Assigned Currently"
              : "No Past / Completed Tuitions Recorded"}
          </h3>
          <p className="text-xs text-[#5A6578] mt-1.5 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? "Try adjusting your search keywords to find the student assignment."
              : activeTab === "active"
              ? "Our matching team reviews new student enquiries daily. As soon as a tuition matching your preferred Patna localities and subjects is confirmed, it will appear here."
              : "When a student completes their semester, academic year, or board exam preparation, their archived records and historical sessions will remain saved here for your records."}
          </p>

          {activeTab === "active" && !searchQuery && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={formatWhatsAppUrl(CANONICAL_SUPPORT_PHONE, "Hello Swati Home Tuition, I am available for new home tuition assignments in Patna.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0B192C] hover:bg-[#1E3E62] text-white px-4 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" /> Request New Tuitions via Bureau
              </a>
              <Link
                href="/teacher/dashboard/profile"
                className="inline-flex items-center gap-1.5 text-xs font-bold border border-[#E8E6DF] text-[#0B192C] hover:bg-[#F9F8F5] px-4 py-2.5 rounded-xl transition-all"
              >
                Update Teaching Localities
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((asg) => {
            const student = asg.students || asg.student;
            const isCompleted = (asg.status || "").toLowerCase() === "completed";
            const isPaused = (asg.status || "").toLowerCase() === "paused";
            const isCancelled =
              (asg.status || "").toLowerCase() === "cancelled" ||
              (asg.status || "").toLowerCase() === "dropped";
            const isActive = !isCompleted && !isPaused && !isCancelled;

            return (
              <div
                key={asg.id}
                className={`bg-white rounded-3xl overflow-hidden shadow-xs border transition-all hover:shadow-md flex flex-col justify-between ${
                  isActive ? "border-[#E8E6DF]" : "border-[#E8E6DF]/70 bg-neutral-50/30 opacity-95"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 border-b border-[#E8E6DF] flex items-start justify-between gap-3 bg-[#F9F8F5]/60">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <UserCircle className="w-7 h-7 text-[#E5A93C]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-serif text-[#0B192C] leading-snug">
                          {student?.full_name || "Assigned Student"}
                        </h3>
                        <p className="text-xs font-bold text-[#1E3E62] mt-0.5">
                          Class {student?.class_studying || "N/A"} • {student?.board || "CBSE"}
                        </p>
                        <p className="text-xs font-semibold text-[#5A6578] mt-0.5">
                          Subject: <span className="text-[#0B192C] font-bold">{asg.subject || "All Subjects"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Active
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Completed
                        </span>
                      )}
                      {isPaused && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Paused
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Concluded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body Information */}
                  <div className="p-5 space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider">
                          Locality / Address
                        </p>
                        <p className="text-xs font-bold text-[#0B192C] mt-0.5">
                          {student?.locality || "Patna, Bihar"}
                        </p>
                        {student?.address && (
                          <p className="text-xs text-[#5A6578] mt-0.5 line-clamp-2">
                            {student.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Schedule & Timing */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#1E3E62] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider">
                          Teaching Schedule
                        </p>
                        <p className="text-xs font-medium text-[#0B192C] mt-0.5">
                          <strong className="text-[#0B192C]">
                            {asg.classes_per_week || 3} classes/week
                          </strong>{" "}
                          • {asg.session_duration_mins || 60} mins per session
                        </p>
                        {asg.session_days && Array.isArray(asg.session_days) && asg.session_days.length > 0 && (
                          <p className="text-[11px] text-[#5A6578] mt-0.5">
                            Days: <span className="font-semibold text-[#0B192C]">{asg.session_days.join(", ")}</span>
                          </p>
                        )}
                        {asg.session_time && (
                          <p className="text-[11px] text-[#5A6578] mt-0.5">
                            Preferred Time: <span className="font-semibold text-[#0B192C]">{asg.session_time}</span>
                          </p>
                        )}
                        {student?.preferred_timing && !asg.session_time && (
                          <p className="text-[11px] text-[#5A6578] mt-0.5">
                            Preferred Timing: <span className="font-semibold text-[#0B192C]">{student.preferred_timing}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Parent Contact via Bureau Notice */}
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider">
                          Parent Guardian
                        </p>
                        <p className="text-xs font-semibold text-[#0B192C] mt-0.5">
                          {student?.parent_name || "Parent"}
                        </p>
                        <a
                          href={formatWhatsAppUrl(CANONICAL_SUPPORT_PHONE, `Hello Swati Home Tuition Bureau, I would like to coordinate regarding student ${student?.full_name || "Parent"}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-full mt-1.5 font-bold transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-700" />
                          Coordinate via Bureau Desk ({CANONICAL_SUPPORT_PHONE_DISPLAY})
                        </a>
                      </div>
                    </div>

                    {/* Special Notes / Syllabus Focus */}
                    {student?.special_needs && (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                        <span className="font-bold">Focus Note:</span> {student.special_needs}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Quick Actions */}
                <div className="p-4 bg-[#F9F8F5]/80 border-t border-[#E8E6DF] flex flex-wrap items-center justify-between gap-2">
                  {isActive ? (
                    <>
                      <Link
                        href="/teacher/dashboard/sessions"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B192C] hover:bg-[#1E3E62] px-3.5 py-2 rounded-xl transition-all shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C]" /> Log Class
                      </Link>

                      <Link
                        href="/teacher/dashboard/tests"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B192C] bg-white hover:bg-neutral-100 border border-[#E8E6DF] px-3.5 py-2 rounded-xl transition-all shadow-xs"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-[#1E3E62]" /> Record Test
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] text-[#5A6578] font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5A6578]" />
                        {asg.end_date
                          ? `Term ended ${new Date(asg.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                          : "Past Tuition Archive"}
                      </div>

                      <Link
                        href="/teacher/dashboard/sessions"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3E62] hover:text-[#0B192C] transition-colors"
                      >
                        View Past Sessions <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
