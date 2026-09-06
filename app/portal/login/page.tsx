"use client";
import { useState } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Users } from "lucide-react";

export default function ParentLogin() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const res = await fetch("/api/auth/parent-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setSent(true);
    else { const d = await res.json(); setError(d.error || "Failed to send link."); }
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    const res = await fetch("/api/auth/parent-password-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.redirected) window.location.href = res.url;
    else { const d = await res.json().catch(() => ({})); setError(d.error || "Invalid credentials."); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-[#0F4C5C] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Parent Portal</h1>
          <p className="text-white/60 mt-2 text-sm">Track your child's progress & sessions</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="flex border-b border-neutral-100">
            <button onClick={() => { setMode("magic"); setError(""); setSent(false); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "magic" ? "bg-[#0F4C5C] text-white" : "text-neutral-500 hover:text-[#0F4C5C]"}`}>
              📧 Magic Link
            </button>
            <button onClick={() => { setMode("password"); setError(""); setSent(false); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === "password" ? "bg-[#0F4C5C] text-white" : "text-neutral-500 hover:text-[#0F4C5C]"}`}>
              🔐 Password
            </button>
          </div>

          <div className="p-8">
            {mode === "magic" ? (
              sent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-2">Check your email!</h2>
                  <p className="text-sm text-neutral-500">We sent a login link to your registered email address.</p>
                  <button onClick={() => setSent(false)} className="mt-4 text-sm text-[#0F4C5C] font-bold hover:underline">Try again</button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <p className="text-sm text-neutral-500 mb-4">Enter your registered email to receive a one-click login link.</p>
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input type="email" name="email" required placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
                    </div>
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#0F4C5C] disabled:opacity-60 hover:bg-[#0a3a47] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {loading ? "Sending..." : <>Send Magic Link <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handlePassword} className="space-y-4">
                <p className="text-sm text-neutral-500 mb-4">Sign in with your email and password provided by our team.</p>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="email" name="email" required placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type={showPassword ? "text" : "password"} name="password" required placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0F4C5C] disabled:opacity-60 hover:bg-[#0a3a47] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>

          <div className="px-8 pb-6 border-t border-neutral-100 pt-4 text-center">
            <p className="text-xs text-neutral-400">Don't have an account? Our team will set it up for you when your child enrolls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}