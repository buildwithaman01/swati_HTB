import Link from "next/link";
import { LogOut, Users, BookOpen, CreditCard, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F2937] text-white flex flex-col fixed h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold font-serif text-white">Swati Admin</h2>
          <p className="text-xs text-white/50 mt-1">Control Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/admin/teachers" icon={<Users size={20} />} label="Teachers" />
          <NavItem href="/admin/students" icon={<BookOpen size={20} />} label="Students" />
          <NavItem href="/admin/assignments" icon={<Settings size={20} />} label="Assignments" />
          <NavItem href="/admin/finance" icon={<CreditCard size={20} />} label="Finance" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action="/api/auth/logout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl w-full transition-colors text-left text-sm font-medium">
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
    <Link href={href} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium">
      {icon} {label}
    </Link>
  );
}