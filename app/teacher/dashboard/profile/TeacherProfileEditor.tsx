"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  Video,
  Award,
  Globe,
  Sparkles,
  ShieldCheck,
  CreditCard,
  User,
  Plus,
  X,
  Eye,
  Link as LinkIcon,
  HelpCircle,
  Mail,
  Star,
  ExternalLink,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { CANONICAL_LINKS } from "@/lib/constants";

interface Props {
  teacher: any;
}

const COMMON_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science (All)",
  "English",
  "Hindi",
  "Social Science",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Computer Science",
];

const COMMON_CLASSES = [
  "Class 1-5 (Primary)",
  "Class 6-8 (Middle)",
  "Class 9-10 (CBSE/ICSE)",
  "Class 11-12 (Science)",
  "Class 11-12 (Commerce)",
  "Class 11-12 (Arts)",
  "IIT-JEE Foundation",
  "NEET Foundation",
];

const POPULAR_PATNA_LOCALITIES = [
  "Boring Road",
  "Kankarbagh",
  "Patliputra Colony",
  "Bailey Road",
  "Raja Bazar",
  "Ashiana Nagar",
  "Fraser Road",
  "Rajendra Nagar",
  "Saguna More",
  "Danapur",
  "Anisabad",
  "Gola Road",
  "Exhibition Road",
  "Kidwaipuri",
  "Shastri Nagar",
];

const QUALIFICATION_SUGGESTIONS = [
  "B.Tech / B.E.",
  "M.Sc (Physics / Maths / Chemistry)",
  "B.Sc (Hons)",
  "B.Ed / M.Ed",
  "M.A (English / Literature)",
  "B.Com / M.Com",
  "MBBS / BDS",
  "Ph.D / Research Scholar",
];

const INSTITUTION_SUGGESTIONS = [
  "NIT Patna",
  "Patna Science College",
  "Patna University",
  "Patna Women's College",
  "IIT Patna",
  "BIT Mesra (Patna Campus)",
  "IGNOU",
  "Magadh University",
  "Central University of South Bihar",
];

export default function TeacherProfileEditor({ teacher }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract meta from internal_notes
  let meta: any = {};
  try {
    const match = (teacher.internal_notes || "").match(/<!--PROFILE_META:(.*?)-->/s);
    if (match && match[1]) {
      meta = JSON.parse(match[1]);
    }
  } catch {}

  const [photoUrl, setPhotoUrl] = useState(teacher.profile_photo_url || "");
  const [photoInputUrl, setPhotoInputUrl] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoMessageType, setPhotoMessageType] = useState<"success" | "error" | "info">("info");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Subjects as array for multi-chip selection
  const initialSubjects: string[] = Array.isArray(teacher.subjects)
    ? teacher.subjects
    : (teacher.subjects || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  const initialClasses: string[] = Array.isArray(teacher.classes_taught)
    ? teacher.classes_taught
    : (teacher.classes_taught || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  const initialAreas: string[] = Array.isArray(teacher.areas_serviceable)
    ? teacher.areas_serviceable
    : (teacher.areas_serviceable || "").split(",").map((s: string) => s.trim()).filter(Boolean);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubjects);
  const [customSubjectInput, setCustomSubjectInput] = useState("");

  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialClasses);
  const [customClassInput, setCustomClassInput] = useState("");

  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialAreas);
  const [customAreaInput, setCustomAreaInput] = useState("");

  const [formData, setFormData] = useState({
    full_name: teacher.full_name || "",
    headline: meta.headline || `Expert Educator in ${(teacher.subjects || ["Academics"]).join(", ")}`,
    bio: meta.bio || teacher.bio || "",
    gender: teacher.gender || "male",
    phone: teacher.phone || "",
    whatsapp: teacher.whatsapp || teacher.phone || "",
    alt_phone: meta.alt_phone || "",
    email: teacher.email || "",
    qualification: teacher.qualification || "",
    institution: teacher.institution || "",
    marks_percentage: meta.marks_percentage || "",
    graduation_year: meta.graduation_year || "",
    experience_years: teacher.experience_years ?? 3,
    locality: teacher.locality || "Boring Road",
    address: teacher.address || "",
    linkedin_url: meta.linkedin_url || "",
    demo_video_url: meta.demo_video_url || "",
    instagram_url: meta.instagram_url || "",
    portfolio_url: meta.portfolio_url || "",
    facebook_url: meta.facebook_url || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle Photo File Upload directly
  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const previewBlobUrl = URL.createObjectURL(file);
    setPhotoUrl(previewBlobUrl);
    setPhotoLoading(true);
    setPhotoMessageType("info");
    setPhotoMessage("Uploading photo to secure bureau cloud...");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("type", "teacher");
      data.append("id", teacher.id);

      const res = await fetch("/api/upload/photo", {
        method: "POST",
        body: data,
      });

      const resJson = await res.json();
      setPhotoLoading(false);

      if (res.ok && resJson.success && resJson.photoUrl) {
        setPhotoUrl(resJson.photoUrl);
        setPhotoMessageType("success");
        setPhotoMessage("Photo updated and synced to your database and Virtual ID Card!");
        router.refresh();
        setTimeout(() => setPhotoMessage(""), 5000);
      } else {
        setPhotoMessageType("error");
        setPhotoMessage(resJson.error || "Failed to upload photo. Please try again.");
      }
    } catch (err: any) {
      setPhotoLoading(false);
      setPhotoMessageType("error");
      setPhotoMessage("Upload failed: " + err.message);
    }
  }

  // Handle Direct Photo URL Sync
  async function handlePhotoUrlSync() {
    if (!photoInputUrl.trim()) return;

    setPhotoLoading(true);
    setPhotoMessageType("info");
    setPhotoMessage("Syncing photo URL to bureau records...");

    try {
      const res = await fetch("/api/upload/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "teacher",
          id: teacher.id,
          photoUrl: photoInputUrl.trim(),
        }),
      });

      const resJson = await res.json();
      setPhotoLoading(false);

      if (res.ok && resJson.success) {
        setPhotoUrl(photoInputUrl.trim());
        setPhotoInputUrl("");
        setPhotoMessageType("success");
        setPhotoMessage("Photo URL synced successfully! Visible on your ID card.");
        router.refresh();
        setTimeout(() => setPhotoMessage(""), 5000);
      } else {
        setPhotoMessageType("error");
        setPhotoMessage(resJson.error || "Could not sync image URL.");
      }
    } catch (err: any) {
      setPhotoLoading(false);
      setPhotoMessageType("error");
      setPhotoMessage("Error syncing URL: " + err.message);
    }
  }

  // Toggle Helpers for Chips
  function toggleSubject(sub: string) {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  }

  function addCustomSubject() {
    if (!customSubjectInput.trim()) return;
    const clean = customSubjectInput.trim();
    if (!selectedSubjects.includes(clean)) {
      setSelectedSubjects((prev) => [...prev, clean]);
    }
    setCustomSubjectInput("");
  }

  function toggleClass(cls: string) {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  }

  function addCustomClass() {
    if (!customClassInput.trim()) return;
    const clean = customClassInput.trim();
    if (!selectedClasses.includes(clean)) {
      setSelectedClasses((prev) => [...prev, clean]);
    }
    setCustomClassInput("");
  }

  function toggleArea(area: string) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function addCustomArea() {
    if (!customAreaInput.trim()) return;
    const clean = customAreaInput.trim();
    if (!selectedAreas.includes(clean)) {
      setSelectedAreas((prev) => [...prev, clean]);
    }
    setCustomAreaInput("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (selectedSubjects.length === 0) {
      setError("Please select or add at least one subject taught.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/teacher/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacher.id,
          profile_photo_url: photoUrl,
          subjects: selectedSubjects,
          classes_taught: selectedClasses,
          areas_serviceable: selectedAreas,
          ...formData,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok && data.success) {
        setSuccess("Profile updated successfully! All details and ID card are in sync.");
        router.refresh();
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  const isVerified = teacher.verification_status === "approved";

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      {/* Institutional Top Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#E8E6DF] overflow-hidden">
        {/* Cover Banner with Deep Oxford Navy and Radiant Amber */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] relative p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-white/95">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold bg-[#E5A93C] text-[#0B192C] px-3 py-1 rounded-full shadow-sm">
                Swati HTB · Faculty Portal
              </span>
              <span className="text-xs text-white/70 hidden sm:inline-block">
                Patna Academic Division
              </span>
            </div>
            <Link
              href="/teacher/dashboard/id-card"
              className="text-xs font-bold bg-white text-[#0B192C] hover:bg-[#F9F8F5] px-4 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 border border-white/20"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#E5A93C]" /> View Official ID Card
            </Link>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-amber-200/90 tracking-wider">
              FACULTY ID: {teacher.teacher_id}
            </span>
          </div>
        </div>

        {/* Profile Avatar Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Camera upload button */}
            <div className="relative inline-block self-start">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-1.5 shadow-xl border-2 border-[#E5A93C] overflow-hidden relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={formData.full_name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-4xl">
                    {formData.full_name.charAt(0) || "T"}
                  </div>
                )}

                {photoLoading && (
                  <div className="absolute inset-0 bg-[#0B192C]/80 rounded-xl flex flex-col items-center justify-center text-white text-xs font-bold p-2 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mb-1 text-[#E5A93C]" />
                    Processing Photo...
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Profile Photo"
                className="absolute bottom-2 right-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white p-2.5 rounded-xl shadow-lg border-2 border-white transition-all transform hover:scale-105 flex items-center gap-1"
              >
                <Camera className="w-4 h-4 text-[#E5A93C]" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
            </div>

            {/* Quick Actions & Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 ${isVerified ? "text-emerald-600" : "text-amber-600"}`}
                />
                {isVerified ? "Verified Bureau Faculty" : "Verification In Progress"}
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#F9F8F5] text-[#1E3E62] border border-[#E8E6DF]">
                {teacher.teacher_id}
              </span>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#E5A93C]" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Teacher Name & Headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C]">
              {formData.full_name || "Faculty Member"}
            </h1>
            <p className="text-sm text-[#1E3E62] mt-1 font-semibold">{formData.headline}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A6578] mt-2">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#E5A93C]" />
                {formData.qualification || "Qualification not specified"}{" "}
                {formData.institution ? `(${formData.institution})` : ""}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                {formData.locality || "Patna, Bihar"}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#E5A93C]" />
                {formData.experience_years} Years Experience
              </span>
            </div>
          </div>

          {/* Direct Photo URL Sync Drawer */}
          <div className="mt-4 pt-3 border-t border-[#E8E6DF]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-[#5A6578] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={photoInputUrl}
                  onChange={(e) => setPhotoInputUrl(e.target.value)}
                  placeholder="Or paste an image web link (https://...)"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] focus:bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handlePhotoUrlSync}
                disabled={!photoInputUrl.trim() || photoLoading}
                className="bg-[#1E3E62] hover:bg-[#0B192C] text-white disabled:opacity-40 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Apply Photo URL
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {photoMessage && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                photoMessageType === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : photoMessageType === "error"
                  ? "bg-rose-50 border border-rose-200 text-rose-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
              }`}
            >
              {photoMessageType === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : photoMessageType === "error" ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              )}
              {photoMessage}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Academic Credentials & Degree */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 border-b border-[#E8E6DF] pb-3 font-serif">
            <GraduationCap className="w-5 h-5 text-[#E5A93C]" /> Academic Qualifications & College
          </h2>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              Highest Qualification *
            </label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              placeholder="e.g. M.Sc Physics / B.Tech / B.Ed"
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white font-medium text-[#1A1D20]"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUALIFICATION_SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, qualification: q }))}
                  className="text-[11px] font-semibold bg-[#F9F8F5] text-[#1E3E62] hover:bg-[#E8E6DF] px-2 py-0.5 rounded-lg border border-[#E8E6DF] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              University / College / Institute *
            </label>
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g. NIT Patna / Patna Science College"
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white font-medium text-[#1A1D20]"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {INSTITUTION_SUGGESTIONS.map((inst) => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, institution: inst }))}
                  className="text-[11px] font-semibold bg-[#F9F8F5] text-[#1E3E62] hover:bg-[#E8E6DF] px-2 py-0.5 rounded-lg border border-[#E8E6DF] transition-colors"
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Marks / CGPA
              </label>
              <input
                name="marks_percentage"
                value={formData.marks_percentage}
                onChange={handleChange}
                placeholder="e.g. 88.5% or 9.0 CGPA"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Graduation Year
              </label>
              <input
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                placeholder="e.g. 2022"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Teaching Experience & Personal Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 border-b border-[#E8E6DF] pb-3 font-serif">
            <Award className="w-5 h-5 text-[#E5A93C]" /> Experience & Identity
          </h2>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              Full Legal Name *
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full text-sm font-semibold border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Teaching Experience (Years) *
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                max="40"
                className="w-full text-sm font-bold border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none bg-white font-medium text-[#1A1D20]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Primary Phone (Calling) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#5A6578] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full text-sm border border-[#E8E6DF] rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                WhatsApp Number *
              </label>
              <div className="relative">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full text-sm border border-[#E8E6DF] rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Alternate / Emergency Phone
              </label>
              <input
                name="alt_phone"
                value={formData.alt_phone}
                onChange={handleChange}
                placeholder="Secondary contact number"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#5A6578] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tutor@gmail.com"
                  className="w-full text-sm border border-[#E8E6DF] rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bureau Helpline Quick Note */}
          <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF] text-[11px] text-[#5A6578] flex items-center justify-between gap-2">
            <span>Official Bureau Desk: <strong className="text-[#0B192C]">+91 75490 97748</strong></span>
            <span className="text-emerald-700 font-semibold">support@swatihometuition.in</span>
          </div>
        </div>

        {/* Section 3: Subjects Taught (Interactive Chip Multi-Select) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
            <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 font-serif">
              <BookOpen className="w-5 h-5 text-[#E5A93C]" /> Subjects Taught ({selectedSubjects.length} selected)
            </h2>
            <span className="text-xs text-[#5A6578]">Click chips to add or remove</span>
          </div>

          {/* Preset Subject Chips */}
          <div className="flex flex-wrap gap-2">
            {COMMON_SUBJECTS.map((sub) => {
              const active = selectedSubjects.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    active
                      ? "bg-[#0B192C] text-white border-[#0B192C] shadow-sm"
                      : "bg-[#F9F8F5] text-[#1E3E62] border-[#E8E6DF] hover:border-[#1E3E62]"
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-[#5A6578]" />
                  )}
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Custom Subject Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={customSubjectInput}
              onChange={(e) => setCustomSubjectInput(e.target.value)}
              placeholder="Add other subject (e.g. Sanskrit, French, Coding)..."
              className="text-xs flex-1 border border-[#E8E6DF] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#0B192C]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSubject();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomSubject}
              className="bg-[#1E3E62] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#0B192C] transition-colors"
            >
              Add Subject
            </button>
          </div>

          {/* Selected Summary */}
          {selectedSubjects.length > 0 && (
            <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF] flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-[#5A6578] uppercase mr-2">
                Active Selection:
              </span>
              {selectedSubjects.map((sub) => (
                <span
                  key={sub}
                  className="bg-white text-[#0B192C] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E8E6DF] flex items-center gap-1"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Classes Handled */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 border-b border-[#E8E6DF] pb-3 font-serif">
            <Sparkles className="w-5 h-5 text-[#E5A93C]" /> Classes & Grades Handled
          </h2>

          <div className="flex flex-wrap gap-2">
            {COMMON_CLASSES.map((cls) => {
              const active = selectedClasses.includes(cls);
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => toggleClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    active
                      ? "bg-[#1E3E62] text-white border-[#1E3E62] shadow-sm"
                      : "bg-[#F9F8F5] text-[#1E3E62] border-[#E8E6DF] hover:border-[#1E3E62]"
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-[#5A6578]" />
                  )}
                  {cls}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={customClassInput}
              onChange={(e) => setCustomClassInput(e.target.value)}
              placeholder="Add other grade level..."
              className="text-xs flex-1 border border-[#E8E6DF] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#0B192C]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomClass();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomClass}
              className="bg-[#1E3E62] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#0B192C] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 5: Service Localities in Patna */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 border-b border-[#E8E6DF] pb-3 font-serif">
            <MapPin className="w-5 h-5 text-[#E5A93C]" /> Preferred Patna Localities
          </h2>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              Primary Residence Locality
            </label>
            <input
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Boring Road, Kankarbagh"
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1.5">
              Serviceable Localities (Parents match with you based on these)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {POPULAR_PATNA_LOCALITIES.map((loc) => {
                const active = selectedAreas.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleArea(loc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      active
                        ? "bg-[#0B192C] text-white border-[#0B192C]"
                        : "bg-[#F9F8F5] text-[#1E3E62] border-[#E8E6DF] hover:bg-[#E8E6DF]"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customAreaInput}
              onChange={(e) => setCustomAreaInput(e.target.value)}
              placeholder="Add other Patna neighborhood..."
              className="text-xs flex-1 border border-[#E8E6DF] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#0B192C]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomArea();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomArea}
              className="bg-[#1E3E62] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#0B192C] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 6: Bio & Teaching Philosophy */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 border-b border-[#E8E6DF] pb-3 font-serif">
            <Sparkles className="w-5 h-5 text-[#E5A93C]" /> Professional Headline & Educator Bio
          </h2>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              Professional Headline (Displayed under your name on search & ID card)
            </label>
            <input
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Senior CBSE & ICSE Mathematics Educator | 6+ Yrs Experience"
              className="w-full text-sm font-semibold border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
                Educator Bio / Teaching Methodology *
              </label>
              <span className="text-[11px] text-[#5A6578]">
                {formData.bio.length} characters
              </span>
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Share your teaching approach, patience with students, board exam score improvement track record, and how you conduct regular weekly chapter tests..."
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 focus:ring-2 focus:ring-[#0B192C]/20 outline-none leading-relaxed text-[#1A1D20]"
            />
            <p className="text-[11px] text-[#5A6578] mt-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#E5A93C]" />
              Tip: Tutors with a detailed bio receive 3.5× more direct tuition requests from parents in Patna.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
              Full Residential Address (Internal Bureau Records Only)
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Flat number, Street, Landmark, Patna..."
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#1A1D20]"
            />
          </div>
        </div>

        {/* Section 7: Social & Video Links */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF] space-y-5 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
            <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2 font-serif">
              <Globe className="w-5 h-5 text-[#E5A93C]" /> Social Presence, Video & External Profiles
            </h2>
            <span className="text-xs text-[#5A6578]">Optional portfolio links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Demo Lecture / Sample Video Link (YouTube or Drive)
              </label>
              <input
                type="url"
                name="demo_video_url"
                value={formData.demo_video_url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=... or Drive link"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Instagram Profile / Handle
              </label>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/yourhandle or @handle"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Facebook Profile / Page URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/yourprofile"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block mb-1">
                Educator Website / Research / Portfolio Link
              </label>
              <input
                type="url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                placeholder="https://yourwebsite.com or GitHub / ResearchGate"
                className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
              />
            </div>
          </div>

          {/* Teacher Google Review Callout */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-[#F9F8F5] rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#E5A93C] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-[#E5A93C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B192C]">
                  Help other educators and students in Patna find Swati HTB!
                </p>
                <p className="text-[11px] text-[#5A6578] mt-0.5">
                  Share your teaching experience and rate our bureau on Google Business Profile.
                </p>
              </div>
            </div>
            <a
              href={CANONICAL_LINKS.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0B192C] hover:bg-[#1E3E62] text-white px-4 py-2 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Rate Swati HTB on Google <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C]" />
            </a>
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E6DF]">
        <Link
          href="/teacher/dashboard/id-card"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E8E6DF] font-bold text-sm text-[#1E3E62] hover:bg-[#F9F8F5] transition-colors flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4 text-[#E5A93C]" /> View Updated ID Card
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#E5A93C]" /> Save Profile Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
