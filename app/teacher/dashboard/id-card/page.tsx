import { createClient } from "@/utils/supabase/server";
import { Download, ShieldCheck, ShieldAlert } from "lucide-react";
import IDCardDownloader from "./IDCardDownloader";

export default async function TeacherIDCardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get teacher ID
  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!teacher) return null;

  const isVerified = teacher.verification_status === "approved";
  const verifyUrl = `https://swatihometuition.in/verify/${teacher.teacher_id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Virtual ID Card & QR</h1>
        <p className="text-sm text-neutral-500 mt-1">Show this to parents to prove your identity and verification status.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ID Card Display */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-200/60 inline-block w-full max-w-[332px]">
          <div id="virtual-id-card" className="w-[300px] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
            {/* ID Header */}
            <div className={`h-24 p-4 text-center text-white flex flex-col items-center justify-center ${isVerified ? 'bg-[#0F4C5C]' : 'bg-neutral-400'}`}>
              <div className="w-40 h-10 relative mt-1">
                <img src="/images/logo12.png" alt="Swati Home Tuition Bureau" className="w-full h-full object-contain filter brightness-0 invert" />
              </div>
              <p className="text-[10px] uppercase tracking-widest opacity-80 mt-2">Home Tuition Bureau</p>
            </div>
            
            {/* Photo & Badge */}
            <div className="relative px-6 pb-6">
              <div className="flex justify-center -mt-10">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-sm">
                  <div className="w-full h-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    {teacher.profile_photo_url ? (
                      <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-300">
                        {teacher.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mt-3">
                <h3 className="font-bold text-lg text-[#1F2937]">{teacher.full_name}</h3>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">ID: {teacher.teacher_id}</p>
                
                <div className="flex justify-center mt-2">
                  {isVerified ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Tutor
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full">
                      <ShieldAlert className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-dashed border-neutral-200 pt-4 flex justify-between items-center">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Valid Until</p>
                  <p className="text-xs font-medium text-neutral-700">Dec 2027</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase mt-2">Subject</p>
                  <p className="text-xs font-medium text-neutral-700 truncate w-24">{(teacher.subjects || [])[0] || 'Tutor'}</p>
                </div>
                
                <div className="w-20 h-20 bg-white p-1 rounded-lg border border-neutral-200 shrink-0">
                  <img src={qrCodeUrl} alt="Verification QR" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
          <IDCardDownloader targetId="virtual-id-card" teacherName={teacher.full_name} />
        </div>

        {/* Instructions */}
        <div className="flex-1 space-y-6 max-w-lg">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 text-sm mb-2">How to use your Virtual ID</h3>
            <ul className="text-xs text-blue-800 space-y-2 list-disc list-inside">
              <li>Show this ID card on your phone when visiting a student for a demo or first class.</li>
              <li>Parents can scan the QR code to instantly verify your identity and approval status on our official website.</li>
              <li>You can screenshot this card to save it to your phone's photo gallery.</li>
            </ul>
          </div>
          
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-6">
            <h3 className="font-bold text-[#1F2937] text-sm mb-2">Your Verification Link</h3>
            <p className="text-xs text-neutral-500 mb-3">You can also share this link directly via WhatsApp:</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={verifyUrl} 
                className="flex-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg p-2 outline-none" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
