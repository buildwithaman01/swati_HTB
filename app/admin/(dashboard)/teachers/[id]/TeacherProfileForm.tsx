"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  teacher: any;
}

export default function TeacherProfileForm({ teacher }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: teacher.full_name || "",
    gender: teacher.gender || "other",
    phone: teacher.phone || "",
    whatsapp: teacher.whatsapp || "",
    email: teacher.email || "",
    address: teacher.address || "",
    locality: teacher.locality || "",
    qualification: teacher.qualification || "",
    institution: teacher.institution || "",
    experience_years: teacher.experience_years ?? 0,
    subjects: (teacher.subjects || []).join(", "),
    classes_taught: (teacher.classes_taught || []).join(", "),
    areas_serviceable: (teacher.areas_serviceable || []).join(", "),
    profile_visibility: teacher.profile_visibility || "public",
    badge_level: teacher.badge_level || "verified",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacher.id,
          type: "profile",
          ...formData,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess("✅ Profile data saved successfully!");
        router.refresh();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update profile data.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
        <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#0F4C5C]" /> Profile Data
        </h2>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-800 text-sm font-semibold rounded-xl flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Personal */}
        <div className="md:col-span-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">Personal</h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Full Name</label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Contact & Location */}
        <div className="md:col-span-2 pt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">Contact & Location</h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">WhatsApp</label>
          <input
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Locality (Short)</label>
          <input
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            placeholder="e.g. Boring Road, Kankarbagh"
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Full Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
          />
        </div>

        {/* Education & Expertise */}
        <div className="md:col-span-2 pt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">Education & Expertise</h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Highest Qualification</label>
          <input
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Institution / College</label>
          <input
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Years of Experience</label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Teaching Preferences */}
        <div className="md:col-span-2 pt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">
            Teaching Preferences <span className="text-neutral-400 font-normal lowercase">(comma-separated)</span>
          </h3>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Subjects Taught</label>
          <input
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="e.g. Mathematics, Physics, Chemistry"
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Classes Taught</label>
          <input
            name="classes_taught"
            value={formData.classes_taught}
            onChange={handleChange}
            placeholder="e.g. Class 9, Class 10, Class 11, Class 12"
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Serviceable Areas</label>
          <input
            name="areas_serviceable"
            value={formData.areas_serviceable}
            onChange={handleChange}
            placeholder="e.g. Boring Road, Patliputra, Kankarbagh"
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* System Settings */}
        <div className="md:col-span-2 pt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">System Settings</h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Profile Visibility</label>
          <select
            name="profile_visibility"
            value={formData.profile_visibility}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
          >
            <option value="public">Public (Visible on website)</option>
            <option value="private">Private (Hidden)</option>
            <option value="unlisted">Unlisted (Direct link only)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Badge Level</label>
          <select
            name="badge_level"
            value={formData.badge_level}
            onChange={handleChange}
            className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none bg-white"
          >
            <option value="pending">No Badge (Pending)</option>
            <option value="verified">Verified (Standard)</option>
            <option value="certified">Certified (Tested)</option>
            <option value="elite">Elite (Top Tier)</option>
          </select>
        </div>
      </div>
    </form>
  );
}
