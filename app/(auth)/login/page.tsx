

"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Check, Lock, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import { fontClass } from "@/lib/fonts";

export default function LoginPage() {
  // ===== LOGIKA (tidak diubah) =====
  const { handleLogin, loading, error } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ identifier, password });
  };
  // =================================
  const [remember, setRemember] = useState(true);

  return (
    <div className={`${fontClass} min-h-screen bg-[#f8fafc] flex flex-col text-gray-900`}>
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
        <Logo sub="Platform Operasi Katering Kampus & Acara" />
        <div className="flex items-center gap-6 text-[13px] text-gray-500">
          <span className="w-[34px] h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center px-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle size={14} />
            Pusat Bantuan
          </span>
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-[1fr_480px] gap-16 max-w-[1280px] w-full mx-auto px-8 py-14 items-center">
        <section>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-emerald-50 shadow-lg h-[395px] relative overflow-hidden">
            <div className="absolute left-[27%] top-[22%] w-[300px] rounded-xl bg-gray-900 text-white p-3 text-[10px]">
              <div className="flex items-center gap-1.5 mb-2">
                <i className="w-2 h-2 rounded-full bg-red-400" />
                <i className="w-2 h-2 rounded-full bg-amber-400" />
                <i className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-semibold tracking-wide">DAPUR BAROKAH • LIVE HUB</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-2 text-gray-900">
                <div className="bg-orange-50 border border-orange-200 rounded p-2">
                  <div className="text-[8px] text-gray-500">ANTREAN MASAK</div>
                  <b className="text-lg">14</b> Porsi
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                  <div className="text-[8px] text-gray-500">REDIS LOCK TTL</div>
                  <b className="text-lg font-[family-name:var(--font-mono)]">300</b>
                </div>
              </div>
            </div>
            <div className="absolute left-[7%] top-[20%] bg-white border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 shadow">
              <MessageCircle className="text-emerald-500" size={26} />
              <div className="text-[10px]">
                <b>WhatsApp RAG Bot</b>
                <div className="text-gray-500">Auto-Reply &lt; 1.2 Detik</div>
              </div>
            </div>
            <div className="absolute right-[3%] top-[18%] bg-white border border-orange-200 rounded-xl p-2.5 flex items-center gap-2 shadow">
              <Lock className="text-orange-600" size={20} />
              <div className="text-[10px]">
                <b>Zero Overbooking</b>
                <div className="text-gray-500">Redis Atomic Lock</div>
              </div>
            </div>
            <div className="absolute right-[6%] bottom-[7%] bg-gray-900 text-white rounded-xl p-3 flex items-center gap-2 shadow">
              <TrendingUp className="text-emerald-400" size={18} />
              <div className="text-[9px]">
                <div className="text-gray-400">TARGET MARGIN KAS</div>
                <b className="text-emerald-400 text-sm font-[family-name:var(--font-mono)]">+Rp 816.500</b>
              </div>
            </div>
            <div className="absolute left-[10%] bottom-[7%] bg-white border border-gray-200 rounded-xl p-2.5 text-[10px] shadow">
              <b>SLA Antar Kampus</b>
              <div className="font-[family-name:var(--font-mono)] text-indigo-600 font-bold">14 Menit</div>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Sistem Operasi Kantin & Katering V2.4
          </div>
          <h1 className="mt-3 text-[38px] leading-[1.15] font-extrabold tracking-tight">
            Otomatisasi Pesanan Dapur,
            <br />
            <span className="text-orange-600">Nol Porsi Terbuang!</span>
          </h1>
          <p className="mt-3 max-w-[570px] text-[14px] leading-6 text-gray-500">
            Platform terpusat untuk mengelola antrean pesanan makan siang, mekanisme proteksi kuota instan via holding lock Redis 300 detik, integrasi WhatsApp AI, dan kalkulasi margin kas real-time.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-[11px] font-bold tracking-[0.18em] text-orange-600 font-[family-name:var(--font-mono)]">PORTAL PENJUAL RESMI</div>
          <h2 className="mt-2 text-[30px] font-extrabold tracking-tight">Manajemen Dapur</h2>
          <p className="mt-2 text-[14px] leading-6 text-gray-500">Akses kontrol stok harian, live antrean kantin, dan laporan keuangan stand katering Anda.</p>

          {error && <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[14px] font-semibold mb-2">Nomor / Email Merchant</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="08123456789 atau user@mail.com"
                className="w-full h-12 bg-slate-50 border border-gray-200 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[14px] font-semibold">Kata Sandi</label>
                <span className="text-[13px] font-semibold text-orange-600">Lupa PIN?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-12 bg-slate-50 border border-gray-200 rounded-xl px-4 text-[14px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setRemember(!remember)}>
                <span className={`w-5 h-5 rounded flex items-center justify-center ${remember ? "bg-orange-600 text-white" : "border border-gray-300"}`}>
                  {remember && <Check size={13} strokeWidth={3} />}
                </span>
                Ingat perangkat stand ini
              </label>
              <span className="text-gray-400 text-[12px]">Sesi 30 hari</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-white font-bold text-[15px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {loading ? "Memvalidasi..." : "Masuk"}
            </button>
            <Link href="/register" className="flex items-center justify-center w-full h-12 rounded-xl bg-slate-100 text-gray-600 font-semibold text-[15px] hover:bg-slate-200 transition">
              Daftar
            </Link>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-[13px] text-gray-500">
            daftarkan stand katering Anda?{" "}
            <Link href="/register" className="font-bold text-orange-600">
              Daftar Merchant Baru
            </Link>
          </div>
        </section>
      </main>

      <footer className="h-[50px] bg-white border-t border-gray-200 px-8 flex items-center justify-between text-[12px] text-gray-400">
        <span>
          <b className="text-gray-800 font-semibold mr-2">KateringKita</b>Sistem Manajemen Dapur Terpadu
        </span>
        <span className="flex gap-6">
          <span>Kebijakan Privasi</span>
          <span>Ketentuan Layanan</span>
          <span>Versi 2.4.0 (Build Stable)</span>
        </span>
      </footer>
    </div>
  );
}
