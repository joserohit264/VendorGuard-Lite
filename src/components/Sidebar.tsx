"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Database, FileText, Settings } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#0B1121] text-slate-300">
            <div className="flex h-16 items-center border-b border-white/10 px-6">
                <ShieldCheck className="mr-2 h-6 w-6 text-emerald-500" />
                <span className="text-lg font-bold text-slate-100">VendorGuard</span>
            </div>

            <nav className="space-y-1 p-4">
                <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isActive={pathname === "/"} />
                <NavItem href="/vendors" icon={<Database size={20} />} label="Vendor Registry" isActive={pathname === "/vendors"} />
                <NavItem href="/assessments" icon={<FileText size={20} />} label="Assessments" isActive={pathname === "/assessments"} />
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center rounded-lg bg-white/5 p-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        J
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Jose Design</p>
                        <p className="text-xs text-slate-400">Admin</p>
                    </div>
                    <Settings className="ml-auto h-4 w-4 text-slate-500 hover:text-white cursor-pointer" />
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? "bg-indigo-500/10 text-indigo-400"
                : "hover:bg-white/5 hover:text-white"
                }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </Link>
    );
}
