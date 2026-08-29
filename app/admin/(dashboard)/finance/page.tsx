import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle2, Plus, CreditCard, Clock } from "lucide-react";

export default async function AdminFinance() {
  const supabase = await createAdminClient();

  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-08"

  const [
    { data: payments },
    { data: assignments },
    { data: commissions },
    { data: monthlyRevenue },
  ] = await Promise.all([
    supabase
      .from("payments")
      .select(`
        *,
        student:students(full_name, student_id, parent_name, parent_phone),
        assignment:assignments(subject, monthly_fee, teacher:teachers(full_name))
      `)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("assignments")
      .select(`
        id, assignment_id, monthly_fee, bureau_commission_amt, teacher_earning, subject, status,
        teacher:teachers(full_name, teacher_id),
        student:students(full_name, student_id, parent_name)
      `)
      .eq("status", "active"),
    supabase
      .from("commissions")
      .select(`*, teacher:teachers(full_name, teacher_id)`)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.rpc("monthly_revenue_summary").catch(() => ({ data: null })),
  ]);

  async function recordPayment(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    const amount = parseFloat(formData.get("amount") as string);
    const assignmentId = formData.get("assignment_id") as string;

    // Get student_id from assignment
    const { data: asgn } = await adminSupabase
      .from("assignments")
      .select("student_id, bureau_commission_pct, bureau_commission_amt, teacher_earning, teacher_id, teacher_earning")
      .eq("id", assignmentId)
      .single();

    if (!asgn) return;

    const payMonth = formData.get("payment_month") as string;

    // Insert payment
    await adminSupabase.from("payments").insert({
      student_id: asgn.student_id,
      assignment_id: assignmentId,
      amount,
      payment_month: payMonth,
      payment_date: formData.get("payment_date") || new Date().toISOString().slice(0, 10),
      payment_mode: formData.get("payment_mode"),
      upi_ref: formData.get("upi_ref") || null,
      status: "received",
      received_by: "Admin",
    });

    // Auto-create commission record
    await adminSupabase.from("commissions").insert({
      teacher_id: asgn.teacher_id,
      assignment_id: assignmentId,
      month: payMonth,
      gross_amount: amount,
      commission_pct: asgn.bureau_commission_pct,
      commission_amount: asgn.bureau_commission_amt,
      teacher_payout: asgn.teacher_earning,
      status: "pending",
    });

    revalidatePath("/admin/finance");
  }

  async function markCommissionPaid(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    await adminSupabase.from("commissions").update({
      status: "paid",
      payout_date: new Date().toISOString().slice(0, 10),
      payout_mode: formData.get("payout_mode") || "upi",
      payout_ref: formData.get("payout_ref") || null,
    }).eq("id", formData.get("id"));
    revalidatePath("/admin/finance");
  }

  // Calculate summary stats
  const totalMonthlyBilled = assignments?.reduce((s, a) => s + Number(a.monthly_fee), 0) ?? 0;
  const totalCommission = assignments?.reduce((s, a) => s + Number(a.bureau_commission_amt), 0) ?? 0;
  const totalPayouts = assignments?.reduce((s, a) => s + Number(a.teacher_earning), 0) ?? 0;

  const receivedThisMonth = payments
    ?.filter(p => p.payment_month === currentMonth && p.status === "received")
    .reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const pendingCommissions = commissions?.filter(c => c.status === "pending") ?? [];
  const totalPendingPayout = pendingCommissions.reduce((s, c) => s + Number(c.teacher_payout), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Finance</h1>
        <p className="text-neutral-500 text-sm mt-1">Revenue tracking, payments, and teacher payouts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Billing"
          value={`₹${totalMonthlyBilled.toLocaleString("en-IN")}`}
          sub="From active assignments"
          icon={<IndianRupee size={20} />}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          title="Received This Month"
          value={`₹${receivedThisMonth.toLocaleString("en-IN")}`}
          sub={`of ₹${totalMonthlyBilled.toLocaleString("en-IN")} billed`}
          icon={<CheckCircle2 size={20} />}
          color="text-emerald-600"
          bg="bg-emerald-100"
        />
        <StatCard
          title="Bureau Commission"
          value={`₹${totalCommission.toLocaleString("en-IN")}`}
          sub="25% of monthly billing"
          icon={<TrendingUp size={20} />}
          color="text-purple-600"
          bg="bg-purple-100"
        />
        <StatCard
          title="Payouts Due"
          value={`₹${totalPendingPayout.toLocaleString("en-IN")}`}
          sub={`${pendingCommissions.length} teacher(s) pending`}
          icon={<AlertCircle size={20} />}
          color="text-amber-600"
          bg="bg-amber-100"
        />
      </div>

      {/* Record Payment */}
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Plus size={18} className="text-[#0F4C5C]" />
          <h2 className="font-bold text-[#1F2937] text-lg">Record Payment Received</h2>
        </div>
        <form action={recordPayment} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Assignment *</label>
            <select name="assignment_id" required className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              <option value="">Select assignment...</option>
              {assignments?.map(a => (
                <option key={a.id} value={a.id}>
                  {(a.teacher as any)?.full_name} → {(a.student as any)?.full_name} ({a.subject}) — ₹{Number(a.monthly_fee).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Amount (₹) *</label>
            <input name="amount" type="number" required placeholder="e.g. 6000" min="0" step="100" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Payment Month *</label>
            <input name="payment_month" type="month" required defaultValue={currentMonth} className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Payment Date</label>
            <input name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Payment Mode *</label>
            <select name="payment_mode" required className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">UPI Ref / Transaction ID</label>
            <input name="upi_ref" placeholder="Optional" className="px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
          </div>

          <div className="lg:col-span-3">
            <button type="submit" className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md flex items-center gap-2">
              <CreditCard size={16} /> Record Payment
            </button>
          </div>
        </form>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="font-bold text-[#1F2937] text-lg">Payment History</h2>
        </div>
        {(!payments || payments.length === 0) ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium text-sm">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Payment ID</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Month</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Mode</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-[#0F4C5C] font-semibold">{p.payment_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-[#1F2937]">{(p.student as any)?.full_name ?? "—"}</p>
                      <p className="text-xs text-neutral-400">{(p.student as any)?.parent_name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1F2937]">{p.payment_month}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1F2937]">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm capitalize text-neutral-600">{p.payment_mode}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        p.status === "received" ? "bg-emerald-100 text-emerald-700"
                        : p.status === "overdue" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teacher Payouts */}
      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="font-bold text-[#1F2937] text-lg">Teacher Payouts</h2>
        </div>
        {pendingCommissions.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium text-sm">All payouts are clear! 🎉</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Teacher</th>
                  <th className="px-6 py-4 font-semibold">Month</th>
                  <th className="px-6 py-4 font-semibold">Gross Fee</th>
                  <th className="px-6 py-4 font-semibold">Bureau (25%)</th>
                  <th className="px-6 py-4 font-semibold">Teacher Payout</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {commissions?.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-[#1F2937]">{(c.teacher as any)?.full_name ?? "—"}</p>
                      <p className="text-xs font-mono text-neutral-400">{(c.teacher as any)?.teacher_id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{c.month}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{Number(c.gross_amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm text-purple-600 font-medium">₹{Number(c.commission_amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-700">₹{Number(c.teacher_payout).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        c.status === "paid" ? "bg-emerald-100 text-emerald-700"
                        : c.status === "hold" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        <Clock className="w-3 h-3" /> {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === "pending" && (
                        <form action={markCommissionPaid} className="inline-flex gap-2">
                          <input type="hidden" name="id" value={c.id} />
                          <select name="payout_mode" className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5">
                            <option value="upi">UPI</option>
                            <option value="bank">Bank</option>
                            <option value="cash">Cash</option>
                          </select>
                          <button type="submit" className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200">
                            Mark Paid
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color, bg }: {
  title: string; value: string; sub: string;
  icon: React.ReactNode; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
        <p className="text-xs text-neutral-500 uppercase font-semibold tracking-wide">{title}</p>
      </div>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{sub}</p>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
