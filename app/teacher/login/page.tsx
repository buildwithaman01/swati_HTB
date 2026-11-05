"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";

export default function TeacherLogin() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const res = await fetch("/api/auth/teacher-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to send link. Please try again.");
    }
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth/teacher-password-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      window.location.href = data.redirectUrl || "/teacher/dashboard";
    } else if (res.redirected) {
      window.location.href = res.url;
    } else {
      setError(data.error || "Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C5C] via-[#0d3d4a] to-[#1a1a2e] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-[#D4A017]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0F4C5C]/30 blur-[80px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <GraduationCap className="w-8 h-8 text-[#D4A017]" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Teacher Portal</h1>
          <p className="text-white/60 mt-2 text-sm">Swati Home Tuition Bureau</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex border-b border-neutral-100">
            <button
              onClick={() => { setMode("magic"); setError(""); setSent(false); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "magic" ? "bg-[#0F4C5C] text-white" : "text-neutral-500 hover:text-[#0F4C5C]"
                }`}
            >
              📧 Magic Link
            </button>
            <button
              onClick={() => { setMode("password"); setError(""); setSent(false); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "password" ? "bg-[#0F4C5C] text-white" : "text-neutral-500 hover:text-[#0F4C5C]"
                }`}
            >
              🔐 Password
            </button>
          </div>

          <div className="p-8">
            {mode === "magic" ? (
              <>
                {sent ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1F2937] mb-2">Check your email!</h2>
                    <p className="text-sm text-neutral-500">
                      We sent a secure login link to your email. Click it to sign in instantly.
                    </p>
                    <p className="text-xs text-neutral-400 mt-3">Didn't receive it? Check spam or try password login.</p>
                    <button onClick={() => setSent(false)} className="mt-4 text-sm text-[#0F4C5C] font-bold hover:underline">
                      Try again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-500 mb-5">
                        Enter your registered email and we'll send you a one-click login link — no password needed.
                      </p>
                      <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">
                        Email Address, Teacher ID, or Phone
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          name="email"
                          required
                          placeholder="e.g. your@email.com or TCH-2026-XXX"
                          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                        />
                      </div>
                    </div>
                    {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0F4C5C] disabled:opacity-60 hover:bg-[#0a3a47] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? "Sending..." : <>Send Magic Link <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <form onSubmit={handlePassword} className="space-y-4">
                <p className="text-sm text-neutral-500 mb-5">
                  Sign in with your email or Teacher ID and the password set by admin.
                </p>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Email Address, Teacher ID, or Phone
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      name="email"
                      required
                      placeholder="e.g. your@email.com or TCH-2026-XXX"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F4C5C] disabled:opacity-60 hover:bg-[#0a3a47] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-center text-xs text-neutral-400">
                  Forgot password? Contact your admin to reset it.
                </p>
              </form>
            )}
          </div>

          <div className="px-8 pb-6 border-t border-neutral-100 pt-4 text-center">
            <p className="text-xs text-neutral-500">
              Not registered yet?{" "}
              <Link href="/join" className="text-[#0F4C5C] font-bold hover:underline">
                Apply as a teacher
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
