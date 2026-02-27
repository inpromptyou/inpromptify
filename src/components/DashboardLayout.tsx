"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  create: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  tests: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  explore: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  candidates: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  jobs: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  results: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  api: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  upgrade: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

const employerNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { href: "/dashboard/create", label: "Create Test", icon: icons.create },
  { href: "/dashboard/tests", label: "My Tests", icon: icons.tests },
  { href: "/explore", label: "Explore Tests", icon: icons.explore },
  { href: "/dashboard/candidates", label: "Candidates", icon: icons.candidates },
  { href: "/dashboard/analytics", label: "Analytics", icon: icons.analytics },
  { href: "/dashboard/jobs", label: "Jobs", icon: icons.jobs },
  { href: "/dashboard/billing", label: "Billing", icon: icons.upgrade },
  { href: "/dashboard/settings", label: "Settings", icon: icons.settings },
];

const candidateNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { href: "/explore", label: "Explore Tests", icon: icons.explore },
  { href: "/dashboard/results", label: "My Results", icon: icons.results },
  { href: "/dashboard/profile", label: "Profile", icon: icons.profile },
  { href: "/dashboard/settings", label: "Settings", icon: icons.settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const role = (session?.user as Record<string, unknown>)?.role as string || "employer";
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const navItems = role === "candidate" ? candidateNav : employerNav;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const initials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const pageTitle = pathname === "/dashboard" ? "Dashboard"
    : pathname.includes("/create") ? "Create Test"
    : pathname.includes("/tests") ? "My Tests"
    : pathname.includes("/candidates") ? "Candidates"
    : pathname.includes("/analytics") ? "Analytics"
    : pathname.includes("/settings") ? "Settings"
    : pathname.includes("/results") ? "Results"
    : pathname.includes("/profile") ? "Profile"
    : "";

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-sm text-white">
            <span className="text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity">[</span>
            <span className="font-semibold">IF</span>
            <span className="text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity">]</span>
          </span>
          <span className="font-semibold text-white text-sm">InpromptiFy</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 min-h-[40px] rounded-md text-sm transition-colors ${
              isActive(item.href)
                ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 -ml-px pl-[11px]"
                : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Upgrade prompt */}
      <div className="p-3">
        <div className="bg-indigo-500/[0.08] border border-indigo-500/[0.15] rounded-lg p-3.5 mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            {icons.upgrade}
            <span className="text-[12px] font-semibold text-indigo-400">Free Plan</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-2.5">5 tests, 25 candidates/month</p>
          <Link href="/dashboard/billing" className="block text-center bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-medium py-1.5 rounded-md transition-colors">
            Upgrade to Pro
          </Link>
        </div>
      </div>

      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm text-white leading-none truncate">{userName}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0A0F1C]">
      {/* Desktop sidebar */}
      <aside className="w-56 bg-[#0A0F1C] border-r border-white/[0.06] text-gray-400 flex-col shrink-0 hidden md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity" />}

      {/* Mobile sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-[#0A0F1C] border-r border-white/[0.06] text-gray-400 flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-3 p-1 text-gray-500 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#0C1120]/80 backdrop-blur-sm border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center -ml-2 text-gray-400 hover:text-white" aria-label="Open menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              {pageTitle && <h1 className="text-[15px] font-semibold text-white">{pageTitle}</h1>}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/billing" className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/[0.08] hover:bg-indigo-500/[0.14] px-3 py-1.5 rounded-md transition-colors">
                {icons.upgrade}
                Upgrade
              </Link>
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-medium">{initials}</div>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
