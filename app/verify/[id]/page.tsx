import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ShieldCheck, MapPin, BookOpen, GraduationCap, Star, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function VerifyTeacherPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = await createClient();
  const teacherId = params.id.toUpperCase();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("teacher_id", teacherId)
    .single();

  if (!teacher) {
    notFound();
  }

  const isVerified = teacher.verification_status === "approved";
  
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <Link href="/" className="font-serif text-3xl font-bold text-[#1F2937] tracking-tight">
          Swati<span className="text-[#0F4C5C]">HTB</span>
        </Link>
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-2">Official Verification Profile</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-200/60 relative">
        {/* Header Banner */}
        <div className={`h-32 w-full ${isVerified ? 'bg-gradient-to-br from-[#0F4C5C] to-indigo-900' : 'bg-neutral-300'}`}>
        </div>

        {/* Profile Photo */}
        <div className="px-8 -mt-16 flex justify-between items-end">
          <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-md">
            <div className="w-full h-full bg-neutral-100 rounded-xl overflow-hidden">
              {teacher.profile_photo_url ? (
                <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-300">
                  {teacher.full_name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          
          <div className="pb-2">
            {isVerified ? (
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Verified Tutor</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1.5 rounded-full border border-red-200">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Unverified</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">{teacher.full_name}</h1>
            <p className="text-sm text-neutral-500 font-mono mt-1">ID: {teacher.teacher_id}</p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Qualification</p>
                <p className="text-sm font-medium text-[#1F2937] mt-0.5">{teacher.qualification}</p>
                {teacher.experience_years > 0 && (
                  <p className="text-xs text-neutral-500 mt-0.5">{teacher.experience_years} years experience</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Subjects Taught</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(teacher.subjects || []).map((sub: string) => (
                    <span key={sub} className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md">{sub}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Teaching Areas</p>
                <p className="text-sm text-neutral-700 mt-1 line-clamp-2">{(teacher.areas_serviceable || []).join(", ")}</p>
              </div>
            </div>

            {(teacher.rating_average > 0 || teacher.total_reviews > 0) && (
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-[#1F2937]">{teacher.rating_average}</span>
                    <span className="text-sm text-neutral-500">({teacher.total_reviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-neutral-50 p-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500 mb-4">
            This profile is maintained by Swati Home Tuition Bureau. If you wish to hire this tutor, please contact us directly.
          </p>
          <a href="tel:+918873733315" className="inline-block bg-[#1F2937] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-black transition-colors">
            Contact Bureau
          </a>
        </div>
      </div>
    </div>
  );
}
