"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, MessageCircle, CheckCircle2, Eye, EyeOff, UserPlus, Send } from "lucide-react";
import { formatWhatsAppUrl, PARENT_LOGIN_URL, CANONICAL_SUPPORT_PHONE_DISPLAY } from "@/lib/whatsapp";

interface Props {
  studentId: string;
  studentName: string;
  parentEmail: string;
  parentPhone: string;
  authUserId: string | null;
}

export default function StudentAccountManagementCard({ studentId, studentName, parentEmail, parentPhone, authUserId }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loginUrl = PARENT_LOGIN_URL;
  const parentIdentifier = parentEmail || parentPhone;

  // 1-click WhatsApp welcome message
  const welcomeMessage = `🎉 *Welcome to Swati Home Tuition Bureau!*\n\nDear Parent/Guardian of *${studentName}*,\n\nYour Parent Portal account is now ready.\n\n*Your Login Details:*\n🔗 Parent Portal: ${loginUrl}\n📧 Login ID / Phone: ${parentIdentifier}\n🔑 Password: ${password || "[Password set by admin]"}\n\n*How to Access Your Portal:*\n1. Open link: ${loginUrl}\n2. Enter your Phone/Email: ${parentIdentifier}\n3. Enter your Password: ${password || "[Password set by admin]"}\n\n*Portal Features:*\n✅ Track tutor attendance & completed sessions\n✅ Review test scores & monthly progress reports\n✅ View fee receipts & invoice records\n\n📞 Need Assistance? Call/WhatsApp: ${CANONICAL_SUPPORT_PHONE_DISPLAY} (or reply to this message)\n\n— Swati Home Tuition Bureau Team`;

  const whatsappUrl = formatWhatsAppUrl(parentPhone, welcomeMessage);

  async function handleSetPassword() {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!parentEmail) {
      setError("An email address is required to create a login account. Please update Profile Data first.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetEmail: parentEmail,
        targetAuthUserId: authUserId || undefined,
        targetId: studentId,
        newPassword: password,
        createIfMissing: !authUserId,
        targetType: "parent",
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
        <KeyRound className="w-5 h-5 text-[#0F4C5C]" /> Parent Portal Access
      </h2>

      {/* Auth Status */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className={`w-3 h-3 rounded-full ${authUserId ? "bg-emerald-500" : "bg-amber-400"}`} />
        <p className="text-sm font-semibold text-[#1F2937]">
          {authUserId ? "Portal account exists" : "No portal account yet"}
        </p>
        <span className="text-xs text-neutral-400 ml-auto">
          {authUserId ? "Parent can log in" : "Needs email and password to create"}
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
          1-Click WhatsApp Welcome
        </label>
        <p className="text-xs text-neutral-400">Send login credentials to parent via WhatsApp</p>

        <a
          href={password ? whatsappUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { if (!password) { e.preventDefault(); alert("Set a password above first!"); } }}
          className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors group w-full"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Send Portal Details</span>
        </a>

        {(!parentPhone) && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
            ⚠ No phone number on file. Add it in the Profile Data section above.
          </p>
        )}
      </div>
    </div>
  );
}
