"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, MessageCircle, CheckCircle2, Eye, EyeOff, UserPlus, Send } from "lucide-react";
import { formatWhatsAppUrl, TEACHER_LOGIN_URL, CANONICAL_SUPPORT_PHONE_DISPLAY } from "@/lib/whatsapp";

interface Props {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  authUserId: string | null;
  verificationStatus: string;
}

export default function AccountManagementCard({ teacherId, teacherName, teacherEmail, teacherPhone, authUserId, verificationStatus }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loginUrl = TEACHER_LOGIN_URL;
  const teacherLoginId = teacherEmail || teacherPhone;

  // 1-click WhatsApp welcome message
  const welcomeMessage = `🎉 *Welcome to Swati Home Tuition Bureau!*\n\nDear ${teacherName},\n\nYou have been approved as a verified teacher on our platform.\n\n*Your Login Details:*\n🔗 Portal: ${loginUrl}\n📧 Email / ID: ${teacherLoginId}\n🔑 Password: ${password || "[Password set by admin]"}\n\n*Your Teacher ID* will be visible on your dashboard after login.\n\n*Next Steps:*\n1. Log in to your portal: ${loginUrl}\n2. Complete your teacher profile\n3. Set your preferred localities and subjects\n\n📞 Support / Any Issues: ${CANONICAL_SUPPORT_PHONE_DISPLAY} (or reply directly to this message)\n\n— Swati Home Tuition Bureau Team`;

  const whatsappUrl = formatWhatsAppUrl(teacherPhone, welcomeMessage);

  // 1-click WhatsApp approval notification (no password)
  const approvalMessage = `✅ *Your application has been approved!*\n\nDear ${teacherName},\n\nWelcome to *Swati Home Tuition Bureau* — Patna's Most Trusted Tuition Service.\n\nYour profile is now active. You can log in anytime:\n🔗 Portal: ${loginUrl}\n\nOur team will contact you soon with student assignments in your area.\n\n📞 Support: ${CANONICAL_SUPPORT_PHONE_DISPLAY} (or reply here)\n— Swati Home Tuition Bureau Team`;
  const approvalWhatsappUrl = formatWhatsAppUrl(teacherPhone, approvalMessage);

  async function handleSetPassword() {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetEmail: teacherEmail,
        targetAuthUserId: authUserId || undefined,
        targetId: teacherId,
        newPassword: password,
        createIfMissing: !authUserId,
        targetType: "teacher",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setSuccess(data.action === "created"
        ? "✅ Account created! Now send them the WhatsApp welcome message below."
        : "✅ Password updated successfully.");
      router.refresh();
    } else {
      setError(data.error || "Failed to set password.");
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
      <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-[#0F4C5C]" /> Account Management
      </h2>

      {/* Auth Status */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className={`w-3 h-3 rounded-full ${authUserId ? "bg-emerald-500" : "bg-amber-400"}`} />
        <p className="text-sm font-semibold text-[#1F2937]">
          {authUserId ? "Login account exists" : "No login account yet"}
        </p>
        <span className="text-xs text-neutral-400 ml-auto">
          {authUserId ? "Can log in to portal" : "Account will be created when you set a password"}
        </span>
      </div>

      {/* Set / Reset Password */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
          {authUserId ? "Reset Password" : "Set Initial Password"}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a strong password..."
              className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSetPassword}
            disabled={loading || !password}
            className="bg-[#0F4C5C] disabled:opacity-50 hover:bg-[#0a3a47] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? "Saving..." : authUserId ? <><KeyRound className="w-4 h-4" /> Reset</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </div>

        {success && (
          <div className="flex items-start gap-2 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
        )}
      </div>

      {/* WhatsApp Buttons */}
      <div className="space-y-3 pt-2 border-t border-neutral-100">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
          1-Click WhatsApp Actions
        </label>
        <p className="text-xs text-neutral-400">Opens WhatsApp with pre-filled message. Just press send!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Welcome with password */}
          <a
            href={password ? whatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (!password) { e.preventDefault(); alert("Set a password above first, then send the welcome message!"); } }}
            className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors group"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Send Welcome + Password</span>
          </a>

          {/* Just approval — no password */}
          <a
            href={verificationStatus === "approved" ? approvalWhatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (verificationStatus !== "approved") { e.preventDefault(); alert("Approve the teacher first!"); } }}
            className="flex items-center gap-2.5 bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Send Approval Notice</span>
          </a>
        </div>

        {!teacherPhone && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
            ⚠ No WhatsApp number on file. Add it in the Profile Data section above.
          </p>
        )}
      </div>
    </div>
  );
}
