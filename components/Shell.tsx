"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  PanelLeft,
  LogOut,
  ChevronsUpDown,
  LayoutGrid,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Store,
} from "lucide-react";
import Logo from "./Logo";
import { fontClass } from "@/lib/fonts";
import { useAuth } from "@/hooks/useAuth";

const ops = [
  { href: "/dashboard", label: "Dashboard Live", icon: LayoutGrid, badge: 2 },
  { href: "/menu", label: "Kelola Menu & Stok", icon: BookOpen },
  { href: "/riwayat", label: "Riwayat & Laporan Keuangan", icon: BarChart3 },
];

export default function Shell({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const { on, setOn, orders } = useStore();
  const { handleLogout } = useAuth();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{
    id?: number;
    nama_lengkap?: string;
    role?: string;
    nama_usaha?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error("Gagal parse data user:", e);
        }
      }
    }
  }, []);

  const act = orders.filter((o) => o.status === "holding" || o.status === "masak").length;

  const Item = ({ href, label, icon: Icon, badge }: (typeof ops)[number]) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] border-l-2 ${
          active
            ? "bg-orange-50 text-orange-600 font-semibold border-orange-600"
            : "text-gray-600 border-transparent hover:bg-gray-50"
        }`}
      >
        <Icon size={16} strokeWidth={1.6} className={active ? "" : "text-gray-400"} />
        <span className="flex-1">{label}</span>
        {!!badge && (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const displayName = currentUser?.nama_lengkap || "Pengguna Katering";
  const displayRole = (currentUser?.role || "merchant").toUpperCase();
  const displayUsaha = currentUser?.nama_usaha || "Dapur Barokah Katering";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`${fontClass} min-h-screen bg-[#fafafa] text-gray-900`}>
      <header className="h-[52px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-gray-900 transition">
            <PanelLeft size={19} strokeWidth={1.6} />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                displayRole === "ADMIN"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-orange-100 text-orange-700 border border-orange-200"
              }`}
            >
              {displayRole === "ADMIN" ? <Shield size={12} /> : <Store size={12} />}
              {displayRole}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar dari sesi"
            className="flex items-center gap-1.5 text-[13px] font-medium border border-gray-200 rounded-lg px-3 h-8 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </header>

      <div className="h-[30px] bg-white border-b border-gray-200 flex items-center justify-between px-4 text-[11px] text-gray-500">
        <span>
          {displayRole === "ADMIN" ? "Admin Portal" : "Merchant"} <span className="mx-1">›</span>{" "}
          <b className="text-gray-900 font-semibold">{title}</b>
        </span>
        <span className="font-[family-name:var(--font-mono)] text-gray-400">
          <span className="font-[family-name:var(--font-sans)] text-gray-700 font-medium">{displayUsaha}</span>
        </span>
      </div>

      <div className="flex">
        {open && (
          <aside className="w-[245px] shrink-0 bg-white border-r border-gray-200 sticky top-[82px] h-[calc(100vh-82px)] flex flex-col">
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-2 mb-5 bg-gradient-to-br from-slate-50 to-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="flex-1 leading-tight overflow-hidden">
                  <div className="text-[13px] font-bold truncate">{displayUsaha}</div>
                  <div className="text-[10px] text-gray-400 mt-1 truncate">
                    {displayRole === "ADMIN" ? "Hak Akses Administrator" : "Kantin Gedung Vokasi Lt. 1"}
                  </div>
                </div>
                <ChevronsUpDown size={13} className="text-gray-400 shrink-0" />
              </div>

              <div className="px-2 text-[10px] font-semibold tracking-wider text-gray-400 mb-2">OPERASIONAL</div>
              <nav className="space-y-1">
                {ops.map((o) => (
                  <Item key={o.href} {...o} badge={o.badge ? act : undefined} />
                ))}
              </nav>

              <div className="px-2 text-[10px] font-semibold tracking-wider text-gray-400 mt-6 mb-2">KONFIGURASI</div>
              <Item href="/pengaturan" label="Pengaturan Toko" icon={Settings} />
            </div>

            <div className="border-t border-gray-200 p-3">
              <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between mb-3">
                <div>
                  <div className="text-[9px] font-semibold tracking-wider text-gray-400">STATUS DAPUR</div>
                  <div className="text-[13px] font-bold text-emerald-600 mt-1">{on ? "Menerima Order" : "Tutup"}</div>
                </div>
                <button
                  onClick={() => setOn(!on)}
                  className={`w-10 h-[22px] rounded-full p-0.5 transition ${on ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`block w-[18px] h-[18px] rounded-full bg-white transition ${
                      on ? "translate-x-[18px]" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-orange-700 text-[11px] font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div className="flex-1 leading-tight overflow-hidden">
                  <div className="text-[13px] font-bold truncate">{displayName}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{currentUser?.role || "Merchant"}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[12px] font-semibold text-orange-600 hover:text-orange-700"
                >
                  Ganti
                </button>
              </div>
            </div>
          </aside>
        )}
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
