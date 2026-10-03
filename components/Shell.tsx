"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PanelLeft, LogOut, ChevronsUpDown, LayoutGrid, BookOpen, Calculator, BarChart3, MessageCircle, Settings } from "lucide-react";
import Logo from "./Logo";
import { fontClass } from "@/lib/fonts";

const ops = [
  { href: "/dashboard", label: "Dashboard Live", icon: LayoutGrid, badge: 2 },
  { href: "/menu", label: "Kelola Menu & Stok", icon: BookOpen },
  { href: "/copilot", label: "Copilot HPP Simulator", icon: Calculator },
  { href: "/riwayat", label: "Riwayat & Laporan Keuangan", icon: BarChart3 },
  { href: "/template-wa", label: "Template WA & Bot", icon: MessageCircle },
];

export default function Shell({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const { on, setOn, orders } = useStore();
  const router = useRouter();
  const act = orders.filter((o) => o.status === "holding" || o.status === "masak").length;
  const Item = ({ href, label, icon: Icon, badge }: (typeof ops)[number]) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] border-l-2 ${active ? "bg-orange-50 text-orange-600 font-semibold border-orange-600" : "text-gray-600 border-transparent hover:bg-gray-50"}`}
      >
        <Icon size={16} strokeWidth={1.6} className={active ? "" : "text-gray-400"} />
        <span className="flex-1">{label}</span>
        {!!badge && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
      </Link>
    );
  };
  return (
    <div className={`${fontClass} min-h-screen bg-[#fafafa] text-gray-900`}>
      <header className="h-[52px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(!open)} className="text-gray-600">
            <PanelLeft size={19} strokeWidth={1.6} />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <button onClick={() => router.push("/login")} className="flex items-center gap-1.5 text-[13px] font-medium border border-gray-200 rounded-lg px-3 h-8">
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </header>
      <div className="h-[30px] bg-white border-b border-gray-200 flex items-center justify-between px-4 text-[11px] text-gray-500">
        <span>
          Merchant <span className="mx-1">›</span> <b className="text-gray-900 font-semibold">{title}</b>
        </span>
        <span className="font-[family-name:var(--font-mono)] text-gray-400">
          15.09.12 WIB <span className="mx-1">•</span> <span className="font-[family-name:var(--font-sans)]">Dapur Barokah Katering</span>
        </span>
      </div>
      <div className="flex">
        {open && (
          <aside className="w-[245px] shrink-0 bg-white border-r border-gray-200 sticky top-[82px] h-[calc(100vh-82px)] flex flex-col">
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="flex-1 leading-tight">
                  <div className="text-[13px] font-bold">Dapur Barokah Katering</div>
                  <div className="text-[10px] text-gray-400 mt-1">Kantin Gedung Vokasi Lt. 1</div>
                </div>
                <ChevronsUpDown size={13} className="text-gray-400" />
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
                <button onClick={() => setOn(!on)} className={`w-10 h-[22px] rounded-full p-0.5 transition ${on ? "bg-emerald-500" : "bg-gray-300"}`}>
                  <span className={`block w-[18px] h-[18px] rounded-full bg-white transition ${on ? "translate-x-[18px]" : ""}`} />
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-orange-700 text-[11px] font-bold flex items-center justify-center">RR</div>
                <div className="flex-1 leading-tight">
                  <div className="text-[13px] font-bold">Rohan Rifqi</div>
                  <div className="text-[10px] text-gray-400">Penjual Katering</div>
                </div>
                <button onClick={() => router.push("/login")} className="text-[12px] font-semibold text-orange-600">
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
