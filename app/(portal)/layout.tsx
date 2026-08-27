import Link from "next/link";
import { LogOut, BookOpen, Clock, CreditCard, LayoutDashboard, User } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col fixed h-full shadow-sm z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold font-serif text-[#0F4C5C]">Teacher Portal</h2>
          <p className="text-xs text-[#1F2937]/50 mt-1">Swati HTB</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem href="/portal/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/portal/students" icon={<BookOpen size={20} />} label="My Students" />
          <NavItem href="/portal/sessions" icon={<Clock size={20} />} label="Log Session" />
          <NavItem href="/portal/earnings" icon={<CreditCard size={20} />} label="Earnings" />
          <NavItem href="/portal/profile" icon={<User size={20} />} label="My Profile" />
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <form action="/api/auth/logout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 text-[#1F2937]/60 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors text-left text-sm font-medium">
              <LogOut size={20} /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 text-[#1F2937]/70 hover:text-[#0F4C5C] hover:bg-[#0F4C5C]/5 rounded-xl transition-colors text-sm font-medium">
      {icon} {label}
    </Link>
  );
}