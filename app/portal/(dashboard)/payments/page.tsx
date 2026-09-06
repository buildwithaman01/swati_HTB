import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock, IndianRupee } from "lucide-react";

export default async function ParentPayments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: student } = await supabase
    .from("students").select("id, full_name")
    .or(`parent_email.eq.${user.email},email.eq.${user.email}`).single();

  if (!student) redirect("/portal/login");

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", student.id)
    .order("payment_month", { ascending: false });

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    received: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4" /> },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4" /> },
    overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: <AlertCircle className="w-4 h-4" /> },
    refunded: { label: "Refunded", color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 className="w-4 h-4" /> },
  };

  const totalPaid = payments?.filter(p => p.status === "received").reduce((s, p) => s + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Payments</h1>
        <p className="text-sm text-neutral-500 mt-1">Total paid: ₹{totalPaid.toLocaleString("en-IN")}</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
        {(!payments || payments.length === 0) ? (
          <div className="text-center py-16">
            <IndianRupee className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium text-sm">No payment records yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            <div className="grid grid-cols-4 px-5 py-3 bg-neutral-50 text-xs font-bold text-neutral-500 uppercase tracking-wide">
              <span>Month</span>
              <span>Amount</span>
              <span>Mode</span>
              <span>Status</span>
            </div>
            {payments.map((p) => {
              const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
              return (
                <div key={p.id} className="grid grid-cols-4 px-5 py-4 items-center">
                  <p className="font-semibold text-sm text-[#1F2937]">{p.payment_month}</p>
                  <p className="font-bold text-[#1F2937]">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-neutral-500 capitalize">{p.payment_mode || "—"}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
