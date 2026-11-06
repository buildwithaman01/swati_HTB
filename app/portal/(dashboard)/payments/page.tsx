import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle, Clock, IndianRupee, MessageCircle, Phone, ShieldCheck, QrCode } from "lucide-react";
import { CANONICAL_LINKS } from "@/lib/constants";
import { formatSupportWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ParentPayments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const adminClient = await createAdminClient();

  const { data: student } = await adminClient
    .from("students")
    .select("id, full_name, class_studying, parent_name")
    .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  const { data: payments } = await adminClient
    .from("payments")
    .select("*")
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    received: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4" /> },
    paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4" /> },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4" /> },
    overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: <AlertCircle className="w-4 h-4" /> },
    refunded: { label: "Refunded", color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 className="w-4 h-4" /> },
  };

  const paymentList = payments || [];
  const totalPaid = paymentList
    .filter((p) => p.status === "received" || p.status === "paid")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const pendingAmount = paymentList
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const paymentWhatsAppUrl = formatSupportWhatsAppUrl(
    `Hello Swati HTB Accounts, I am ${student.parent_name} (Parent of ${student.full_name}, Class ${student.class_studying || ""}). I am sharing fee payment confirmation / screenshot.`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Tuition Fees & Invoices</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Payment ledger and verified receipts for <span className="font-semibold text-neutral-800">{student.full_name}</span>.
          </p>
        </div>

        <a
          href={paymentWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#1e8a45] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 px-3.5 py-2 rounded-xl transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Send Payment Receipt</span>
        </a>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Total Paid</p>
            <p className="text-2xl font-extrabold text-[#1F2937] mt-0.5">₹{totalPaid.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Pending Due</p>
            <p className="text-2xl font-extrabold text-[#1F2937] mt-0.5">₹{pendingAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Receipt Status</p>
            <p className="text-base font-bold text-[#1F2937] mt-1">100% Verified by Bureau</p>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
        {paymentList.length === 0 ? (
          <div className="text-center py-16">
            <IndianRupee className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium text-sm">No payment records logged yet.</p>
            <p className="text-xs text-neutral-400 mt-1">
              When monthly tuition fees are paid, official receipts will be posted here immediately.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            <div className="grid grid-cols-4 px-5 py-3 bg-neutral-50 text-xs font-bold text-neutral-500 uppercase tracking-wide">
              <span>Month</span>
              <span>Amount</span>
              <span>Payment Mode</span>
              <span className="text-right">Status</span>
            </div>
            {paymentList.map((p) => {
              const statusKey = (p.status || "pending").toLowerCase();
              const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending;
              return (
                <div key={p.id} className="grid grid-cols-4 px-5 py-4 items-center hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-[#1F2937]">{p.payment_month || "Tuition Month"}</p>
                    {p.created_at && (
                      <p className="text-[11px] text-neutral-400">
                        {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-[#1F2937]">₹{Number(p.amount || 0).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-neutral-600 capitalize">{p.payment_mode || "UPI / Direct"}</p>
                  <div className="flex justify-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fee Payment Instructions & WhatsApp Submission Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-[#0F4C5C] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <QrCode className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Official Bureau Fee Confirmation</span>
          </div>
          <h3 className="text-xl font-bold font-serif">
            Made a fee payment via UPI, GPay, or Cash?
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Please share the transaction screenshot or receipt on our WhatsApp accounts desk. Your portal ledger will be credited within 24 hours.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <a
            href={paymentWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Submit Proof on WhatsApp</span>
          </a>
          <a
            href={`tel:${CANONICAL_LINKS.phone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Accounts Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
