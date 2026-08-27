import { createClient } from "@/utils/supabase/server";
import { CreditCard, History, IndianRupee } from "lucide-react";

export default async function EarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, commissions(*)")
    .eq("auth_user_id", user?.id)
    .single();

  const commissions = (teacher?.commissions || []) as any[];

  // Calculate totals
  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.teacher_payout || 0), 0);
  const pendingPayout = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.teacher_payout || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <IndianRupee className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-500/30" />
          <p className="text-emerald-100 font-semibold uppercase tracking-wide text-xs mb-1">Total Paid</p>
          <h2 className="text-4xl font-bold">₹{totalEarned.toLocaleString('en-IN')}</h2>
          <p className="text-emerald-200 text-sm mt-4">Lifetime earnings credited to your bank account.</p>
        </div>

        <div className="bg-amber-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <CreditCard className="absolute -right-4 -bottom-4 w-32 h-32 text-amber-400/30" />
          <p className="text-amber-100 font-semibold uppercase tracking-wide text-xs mb-1">Pending Payout</p>
          <h2 className="text-4xl font-bold">₹{pendingPayout.toLocaleString('en-IN')}</h2>
          <p className="text-amber-100 text-sm mt-4">Usually processed by the 5th of every month.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 mt-8">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
          <History size={20} className="text-[#0F4C5C]" /> Payout History
        </h2>
        
        {commissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Payout Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-[#1F2937]">{c.month}</td>
                    <td className="px-4 py-3">
                      {c.status === 'paid' ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">PAID</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">PENDING</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{c.payout_date ? new Date(c.payout_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#1F2937] text-right">₹{c.teacher_payout?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium text-sm">No earnings history yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}