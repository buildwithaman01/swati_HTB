import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function TeacherLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0F4C5C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#0F4C5C]" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Teacher Portal</h1>
          <p className="text-sm text-neutral-500 mt-2">Sign in to view your students and manage classes.</p>
        </div>

        <form action="/api/auth/teacher-magic-link" method="POST" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              placeholder="Enter your registered email"
              className="w-full text-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" 
            />
          </div>
          
          <button type="submit" className="w-full bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            Send Magic Link <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Not a registered teacher? <Link href="/apply" className="text-[#0F4C5C] font-bold hover:underline">Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
