"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  student: any;
}

export default function StudentProfileForm({ student }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: student.full_name || "",
    parent_name: student.parent_name || "",
    parent_phone: student.parent_phone || "",
    whatsapp: student.whatsapp || "",
    email: student.parent_email || student.email || "",
    locality: student.locality || "",
    address: student.address || "",
    class_studying: student.class_studying || "",
    board: student.board || "CBSE",
    subjects_required: (student.subjects_required || student.subjects_needed || []).join(", "),
    tuition_type_preference: student.tuition_type_preference || "home",
    budget_range: student.budget_range || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: student.id,
          type: "profile",
          ...formData,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess("✅ Student profile data saved successfully!");
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
    <form
      onSubmit={handleSave}
      className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6"
    >
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
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-1">
            Student & Parent
          </h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
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
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Parent / Guardian Name *
          </label>
          <input
            name="parent_name"
            value={formData.parent_name}
            onChange={handleChange}
            required
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Contact & Location */}
        <div className="md:col-span-2 mt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-1">
            Contact & Location
          </h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
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
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            WhatsApp
          </label>
          <input
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="Same as phone if empty"
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
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
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Full Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Locality (Area)
          </label>
          <input
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            placeholder="e.g. Boring Road"
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Academic */}
        <div className="md:col-span-2 mt-2">
          <h3 className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider mb-1">
            Academic & Tuition Needs
          </h3>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Class
          </label>
          <input
            name="class_studying"
            value={formData.class_studying}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
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
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Subjects Required (comma-separated)
          </label>
          <input
            name="subjects_required"
            value={formData.subjects_required}
            onChange={handleChange}
            placeholder="Mathematics, Physics, Chemistry"
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
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
          <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
            Budget Range
          </label>
          <input
            name="budget_range"
            value={formData.budget_range}
            onChange={handleChange}
            placeholder="e.g. 5000-7000/month"
            className="w-full text-sm border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
      </div>
    </form>
  );
}
