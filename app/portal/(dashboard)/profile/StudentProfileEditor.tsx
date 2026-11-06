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
  Target,
  Award,
  Sparkles,
  School,
  User,
} from "lucide-react";

interface Props {
  student: any;
}

export default function StudentProfileEditor({ student }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract meta from internal_notes if present
  let meta: any = {};
  let existingPhoto = "";
  try {
    const metaMatch = (student.internal_notes || "").match(/<!--STUDENT_META:(.*?)-->/s);
    if (metaMatch && metaMatch[1]) {
      meta = JSON.parse(metaMatch[1]);
    }
    const photoMatch = (student.internal_notes || "").match(/\[STUDENT_PHOTO:(.*?)\]/);
    if (photoMatch && photoMatch[1]) {
      existingPhoto = photoMatch[1];
    }
  } catch {}

  const [photoUrl, setPhotoUrl] = useState(existingPhoto || meta.photo_url || "");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: student.full_name || "",
    school_name: meta.school_name || "",
    class_studying: student.class_studying || "",
    board: student.board || "CBSE",
    previous_marks: meta.previous_marks || "",
    target_exam: meta.target_exam || "",
    weak_subjects: meta.weak_subjects || "",
    subjects_required: (student.subjects_required || student.subjects_needed || []).join(", "),
    tuition_type_preference: student.tuition_type_preference || "home",
    parent_name: student.parent_name || "",
    parent_phone: student.parent_phone || "",
    whatsapp: student.whatsapp || student.parent_whatsapp || student.parent_phone || "",
    email: student.parent_email || student.email || "",
    locality: student.locality || "",
    address: student.address || "",
    budget_range: student.budget_range || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle Student Photo File Upload
  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setPhotoMessage("Uploading student photo...");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("type", "student");
      data.append("id", student.id);

      const res = await fetch("/api/upload/photo", {
        method: "POST",
        body: data,
      });

      const resJson = await res.json();
      setPhotoLoading(false);

      if (res.ok && resJson.success && resJson.photoUrl) {
        setPhotoUrl(resJson.photoUrl);
        setPhotoMessage("✅ Student photo updated successfully!");
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
      const res = await fetch("/api/student/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student.id,
          photo_url: photoUrl,
          ...formData,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok && data.success) {
        setSuccess("✅ Student academic profile saved successfully!");
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
      {/* Facebook-Style Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-[#1D3557] via-[#457B9D] to-[#0F4C5C] relative p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-xs uppercase tracking-widest font-bold bg-black/25 backdrop-blur-md px-3 py-1 rounded-full">
              Swati HTB · Student Profile
            </span>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Class {formData.class_studying || "General"} · {formData.board}
            </span>
          </div>
        </div>

        {/* Profile Avatar Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Avatar with Camera upload button */}
            <div className="relative inline-block self-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-xl border border-neutral-200/60 overflow-hidden relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={formData.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1D3557] text-white flex items-center justify-center font-bold text-3xl">
                    {formData.full_name.charAt(0) || "S"}
                  </div>
                )}

                {photoLoading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-xs font-bold">
                    <Loader2 className="w-5 h-5 animate-spin mb-1" />
                    Uploading...
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Student Photo"
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                {student.enrollment_status || "Enrolled"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 text-neutral-700">
                {student.student_id || "STD"}
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

          {/* Student Name & School */}
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#1F2937]">{formData.full_name}</h1>
            <p className="text-sm text-neutral-600 mt-0.5 font-medium">
              {formData.school_name ? `${formData.school_name} · ` : ""}Class {formData.class_studying} ({formData.board})
            </p>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C5C]" /> {formData.locality || "Patna, Bihar"} · Parent: {formData.parent_name}
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

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Academic Details & Targets */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <School className="w-4 h-4 text-[#0F4C5C]" /> School & Academic Target
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Student Full Name *
            </label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              School Name
            </label>
            <input
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              placeholder="e.g. DPS Patna / St. Michael's / Loyola"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Class / Standard *
              </label>
              <input
                name="class_studying"
                value={formData.class_studying}
                onChange={handleChange}
                required
                placeholder="e.g. 10"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Board
              </label>
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">Bihar State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Target Exam / Goal
            </label>
            <input
              name="target_exam"
              value={formData.target_exam}
              onChange={handleChange}
              placeholder="e.g. Target 95%+ in Class 10 Board / JEE Main 2028"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Previous Term Marks / Percentage
            </label>
            <input
              name="previous_marks"
              value={formData.previous_marks}
              onChange={handleChange}
              placeholder="e.g. Last Term: 88.5% (Maths: 92/100)"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>
        </div>

        {/* Section 2: Subjects & Learning Needs */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <BookOpen className="w-4 h-4 text-[#0F4C5C]" /> Subjects & Tuition Needs
          </h2>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Subjects Required (comma-separated) *
            </label>
            <input
              name="subjects_required"
              value={formData.subjects_required}
              onChange={handleChange}
              required
              placeholder="Mathematics, Physics, Chemistry"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Weak Subjects / Areas Needing Special Focus
            </label>
            <textarea
              name="weak_subjects"
              value={formData.weak_subjects}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Algebra word problems, Physics numericals, memorizing chemical equations"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Tuition Preference
            </label>
            <select
              name="tuition_type_preference"
              value={formData.tuition_type_preference}
              onChange={handleChange}
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
            >
              <option value="home">Home Tuition (Teacher visits home)</option>
              <option value="online">Online Tuition</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
              Budget Range
            </label>
            <input
              name="budget_range"
              value={formData.budget_range}
              onChange={handleChange}
              placeholder="e.g. ₹5,000 - ₹7,000 / month"
              className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>
        </div>

        {/* Section 3: Parent & Contact Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <User className="w-4 h-4 text-[#0F4C5C]" /> Parent & Address Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Parent / Guardian Full Name *
              </label>
              <input
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                required
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Parent Phone Number *
              </label>
              <input
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                required
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                WhatsApp Number
              </label>
              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="10-digit number (e.g. 9835012345)"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Used for attendance alerts, test reports, and WhatsApp coordinator messages.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="parent@example.com"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Locality / Area
              </label>
              <input
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="e.g. Boring Road, Patna"
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-1">
                Full Residential Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Apartment, Landmark..."
                className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-200">
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
              <Save className="w-4 h-4" /> Save Student Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}
