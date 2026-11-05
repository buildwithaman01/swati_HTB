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
} from "lucide-react";
import Link from "next/link";

interface Props {
  teacher: any;
}

export default function TeacherProfileEditor({ teacher }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract meta from internal_notes if present
  let meta: any = {};
  try {
    const match = (teacher.internal_notes || "").match(/<!--PROFILE_META:(.*?)-->/s);
    if (match && match[1]) {
      meta = JSON.parse(match[1]);
    }
  } catch {}

  const [photoUrl, setPhotoUrl] = useState(teacher.profile_photo_url || "");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: teacher.full_name || "",
    headline: meta.headline || `Expert Tutor in ${(teacher.subjects || ["Academics"]).join(", ")}`,
    bio: meta.bio || teacher.bio || "",
    gender: teacher.gender || "other",
    phone: teacher.phone || "",
    whatsapp: teacher.whatsapp || teacher.phone || "",
    qualification: teacher.qualification || "",
    institution: teacher.institution || "",
    marks_percentage: meta.marks_percentage || "",
    graduation_year: meta.graduation_year || "",
    experience_years: teacher.experience_years ?? 0,
    locality: teacher.locality || "",
    address: teacher.address || "",
    subjects: (teacher.subjects || []).join(", "),
    classes_taught: (teacher.classes_taught || []).join(", "),
    areas_serviceable: (teacher.areas_serviceable || []).join(", "),
    linkedin_url: meta.linkedin_url || "",
    demo_video_url: meta.demo_video_url || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle Photo File Upload directly (like Facebook / LinkedIn)
  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setPhotoMessage("Uploading photo...");

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
        setPhotoMessage("✅ Photo updated! It now appears on your profile and ID Card.");
        router.refresh();
        setTimeout(() => setPhotoMessage(""), 5000);
      } else {
        setPhotoMessage("❌ " + (resJson.error || "Failed to upload photo"));
      }
    } catch (err: any) {
      setPhotoLoading(false);
      setPhotoMessage("❌ Error: " + err.message);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/teacher/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacher.id,
          profile_photo_url: photoUrl,
          ...formData,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok && data.success) {
        setSuccess("✅ Profile updated successfully! Changes are live on your Virtual ID.");
        router.refresh();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaving(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      {/* Facebook/LinkedIn-Style Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#0F4C5C] via-[#1b5e6f] to-[#e36414] relative p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-xs uppercase tracking-widest font-bold bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
              Swati HTB · Faculty Profile
            </span>
            <Link
              href="/teacher/dashboard/id-card"
              className="text-xs font-bold bg-white text-[#0F4C5C] hover:bg-neutral-100 px-3.5 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" /> View Virtual ID Card
            </Link>
          </div>
        </div>

        {/* Profile Avatar Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Camera upload button */}
            <div className="relative inline-block self-start">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-1.5 shadow-xl border border-neutral-200/60 overflow-hidden relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={formData.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-4xl">
                    {formData.full_name.charAt(0) || "T"}
                  </div>
                )}

                {photoLoading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold">
                    <Loader2 className="w-6 h-6 animate-spin mb-1" />
                    Uploading...
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Photo"
                className="absolute bottom-1 right-1 bg-[#0F4C5C] hover:bg-[#0a3a47] text-white p-2.5 rounded-full shadow-lg border-2 border-white transition-all transform hover:scale-105"
              >
                <Camera className="w-4 h-4" />
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
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {teacher.verification_status === "approved" ? "Verified Tutor" : "Profile Pending Review"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 text-neutral-700">
                {teacher.teacher_id}
              </span>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Teacher Name & Headline */}
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#1F2937]">{formData.full_name}</h1>
            <p className="text-sm text-neutral-600 mt-1 font-medium">{formData.headline}</p>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C5C]" /> {formData.locality || "Patna, Bihar"} · Experience:{" "}
              {formData.experience_years} Years
            </p>
          </div>

          {photoMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
              {photoMessage}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: About Me & Bio */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Sparkles className="w-4 h-4 text-[#0F4C5C]" /> About Me & Teaching Philosophy (Bio)
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1.5">
              Professional Headline
            </label>
            <input
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Senior CBSE & ICSE Mathematics Educator | 6+ Yrs Experience"
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1.5">
              Bio / About You (Parents and Students read this)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell parents about your teaching style, exam prep strategies, patience with students, and notable student achievements..."
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 2: Academic Background & Scores */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <GraduationCap className="w-4 h-4 text-[#0F4C5C]" /> Academic Background & Marks
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Highest Qualification *
            </label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              placeholder="e.g. B.Tech / M.Sc Mathematics / B.Ed"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              University / College / Institute
            </label>
            <input
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g. NIT Patna / Patna Science College"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Marks / CGPA / Honors
              </label>
              <input
                name="marks_percentage"
                value={formData.marks_percentage}
                onChange={handleChange}
                placeholder="e.g. 86.4% or 8.8 CGPA"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Graduation Year
              </label>
              <input
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
                placeholder="e.g. 2021"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Teaching Preferences */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <BookOpen className="w-4 h-4 text-[#0F4C5C]" /> Subjects & Teaching Focus
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Subjects Taught (comma-separated) *
            </label>
            <input
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              required
              placeholder="Mathematics, Physics, Chemistry"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Classes / Grades Handled
            </label>
            <input
              name="classes_taught"
              value={formData.classes_taught}
              onChange={handleChange}
              placeholder="Class 9, Class 10, Class 11, Class 12, JEE"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Location & Areas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <MapPin className="w-4 h-4 text-[#0F4C5C]" /> Location & Serviceable Areas
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Primary Locality
            </label>
            <input
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Boring Road"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Serviceable Areas in Patna (comma-separated)
            </label>
            <input
              name="areas_serviceable"
              value={formData.areas_serviceable}
              onChange={handleChange}
              placeholder="Boring Road, Kankarbagh, Patliputra, Bailey Road, Raja Bazar"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Residential Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Full address for internal records..."
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 5: Contact & Professional Links */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Phone className="w-4 h-4 text-[#0F4C5C]" /> Contact & Social Profiles
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              WhatsApp Number *
            </label>
            <input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Demo / Teaching Sample Video Link
            </label>
            <input
              type="url"
              name="demo_video_url"
              value={formData.demo_video_url}
              onChange={handleChange}
              placeholder="YouTube or Google Drive demo video URL"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Link
          href="/teacher/dashboard/id-card"
          className="px-6 py-3 rounded-xl border border-neutral-300 font-bold text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" /> View ID Card
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm flex items-center gap-2 shadow-md"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}
