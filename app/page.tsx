"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, X, Lock, MessageCircle, Menu as MenuIcon, Clock, Store, Package, TrendingUp, Search } from "lucide-react";
import Logo from "@/components/Logo";
import { fontClass } from "@/lib/fonts";

/* =========================================================
   Landing Page KateringKita — v2
   Sistem visual diambil dari halaman login:
   latar slate-50, kartu putih rounded-2xl, aksen orange (CTA) + emerald (status live),
   heading extrabold rapat, label kecil bergaya mono, panel gelap gray-900.
   ========================================================= */

const MONO = "font-[family-name:var(--font-mono)]";
const EASE = "cubic-bezier(.16,1,.3,1)";

/* ---------- reveal sekali saat masuk viewport (hormati reduced-motion lewat CSS) ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`motion-reduce:!opacity-100 motion-reduce:!transform-none ${className}`}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(20px)",
        transition: `opacity 700ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <div className={`text-[11px] font-bold tracking-[0.18em] text-orange-600 uppercase ${MONO}`}>{children}</div>;
}

function SectionHead({ tag, title, desc }: { tag: string; title: ReactNode; desc?: string }) {
  return (
    <div className="max-w-2xl">
      <Tag>{tag}</Tag>
      <h2 className="mt-3 text-[32px] sm:text-[40px] leading-[1.12] font-extrabold tracking-tight">{title}</h2>
      {desc && <p className="mt-3 text-[15px] leading-7 text-gray-500">{desc}</p>}
    </div>
  );
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-white font-bold text-[15px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition shadow-sm";
const btnGhost = "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[15px] hover:bg-slate-100 transition";

/* =========================================================
   DATA — dari dokumen konteks KateringKita
   ========================================================= */
const NAV = [
  { l: "Masalah", h: "#masalah" },
  { l: "Fitur", h: "#fitur" },
  { l: "Cara Kerja", h: "#cara-kerja" },
];

const STATS = [
  { v: "05:00", l: "Penguncian porsi saat checkout" },
  { v: "Real-time", l: "Stok katalog tersinkron dapur" },
  { v: "3", l: "Kategori: Nasi Box, Snack, Minuman" },
  { v: "WhatsApp", l: "Pesanan diteruskan ke penjual" },
];

const BEFORE = [
  "Katalog WhatsApp manual, stok tidak sinkron dengan dapur",
  "Overbooking dan pencatatan ganda",
  "Pesanan dibatalkan sepihak setelah transfer",
  "Membalas chat satu per satu memakan waktu",
];
const AFTER = [
  "Stok porsi tampil real-time sebelum pembeli memesan",
  "Porsi dikunci 5 menit, tidak ada pesanan dobel",
  "Pembeli pasti tahu: “Tersedia [X] Porsi” atau “Porsi Habis”",
  "Pesan transaksi tersusun otomatis lewat Generator WhatsApp",
];

const FLOW = {
  pembeli: {
    title: "Untuk Pembeli",
    desc: "Dari lihat menu sampai pesanan terkirim ke penjual.",
    steps: [
      ["Pilih menu di Katalog", "Cari nama makanan atau filter Nasi Box, Snack, Minuman. Stok terlihat langsung."],
      ["Cek Detail Menu", "Lihat foto, deskripsi, sisa stok real-time, dan estimasi waktu proses."],
      ["Kunci Porsi & Pesan", "Timer 5 menit menahan porsi Anda saat mengisi nama, alamat, dan catatan."],
      ["Kirim ke WhatsApp Penjual", "Tinjau pesan otomatis, lalu buka WhatsApp penjual dengan satu tombol."],
    ],
  },
  pemilik: {
    title: "Untuk Pemilik Katering",
    desc: "Dari daftar akun toko sampai laporan penjualan.",
    steps: [
      ["Daftar Akun Toko", "Buat akun dan isi biodata toko: nama, alamat, dan logo."],
      ["Isi menu & kuota", "Tambah menu lengkap dengan foto, harga, kuota, dan kategori di Kelola Menu."],
      ["Pantau Dashboard Utama", "Lihat grafik penjualan dan kuota real-time per menu dalam satu layar."],
      ["Buka Toko, catat Riwayat", "Atur Buka Toko / Tutup Toko, lalu rekap transaksi per hari hingga 3 bulan."],
    ],
  },
};

/* =========================================================
   HALAMAN
   ========================================================= */
export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"pembeli" | "pemilik">("pembeli");
  const [range, setRange] = useState(0);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const F = FLOW[role];
  const bars = [
    [38, 52, 30, 64, 48, 72, 58],
    [55, 40, 68, 46, 80, 62, 74],
    [44, 70, 52, 84, 60, 90, 66],
    [60, 48, 76, 58, 88, 70, 94],
  ][range];

  return (
    <div className={`${fontClass} min-h-screen bg-[#f8fafc] text-gray-900`}>
      {/* ================= HEADER ================= */}
      <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur border-b transition-colors ${stuck ? "border-gray-200" : "border-transparent"}`}>
        <div className="max-w-[1280px] mx-auto h-16 px-5 sm:px-8 flex items-center justify-between">
          <Link href="/" aria-label="KateringKita">
            <Logo sub="Platform Operasi Katering Kampus & Acara" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-gray-600">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} className="hover:text-orange-600 transition">
                {n.l}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="h-10 px-4 inline-flex items-center rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-slate-100 transition">
              Masuk / Login
            </Link>
            <Link href="/register" className="h-10 px-5 inline-flex items-center rounded-lg text-[14px] font-bold text-white bg-orange-600 hover:bg-orange-700 transition">
              Daftar Akun Toko
            </Link>
          </div>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="md:hidden size-10 grid place-items-center rounded-lg border border-gray-200"
          >
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-5 pt-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <a key={n.h} href={n.h} onClick={() => setOpen(false)} className="py-3 text-[15px] font-medium text-gray-700 border-b border-gray-100">
                {n.l}
              </a>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/login" className={btnGhost}>
                Masuk / Login
              </Link>
              <Link href="/register" className={btnPrimary}>
                Daftar Toko
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 grid lg:grid-cols-[1fr_560px] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              Untuk katering rumahan & danus kampus
            </div>
            <h1 className="mt-5 text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.05] font-extrabold tracking-tight">
              Stok porsi pasti,
              <br />
              <span className="text-orange-600">pesanan tak batal.</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[16px] leading-7 text-gray-500">
              KateringKita menyinkronkan stok dapur dengan katalog secara real-time. Pembeli tahu porsi tersedia sebelum memesan, pemilik berhenti membalas chat satu per satu.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/register" className={btnPrimary}>
                Daftar Akun Toko <ArrowRight size={18} />
              </Link>
              <Link href="/login" className={btnGhost}>
                Masuk / Login
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-500">
              {["Stok real-time", "Kunci porsi 5 menit", "Pesan via WhatsApp"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-500" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* mockup produk */}
          <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-emerald-50 shadow-lg p-5 sm:p-8 lg:min-h-[520px] flex items-center justify-center">
            <div className="w-full max-w-[340px] rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden">
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2 h-10 rounded-xl bg-slate-50 border border-gray-200 px-3 text-[12px] text-gray-400">
                  <Search size={14} />
                  Cari nama makanan
                </div>
                <div className="mt-3 flex gap-2 text-[11px] font-semibold">
                  <span className="px-3 py-1.5 rounded-full bg-orange-600 text-white">Nasi Box</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-gray-500">Snack</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-gray-500">Minuman</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { n: "Nasi Box Ayam Bakar", s: "Tersedia 14 Porsi", ok: true },
                  { n: "Nasi Box Rendang", s: "Porsi Habis", ok: false },
                ].map((m) => (
                  <div key={m.n} className={`flex items-center gap-3 rounded-xl border p-3 ${m.ok ? "border-gray-200" : "border-gray-100 bg-slate-50"}`}>
                    <div className={`size-12 rounded-lg grid place-items-center ${m.ok ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-400"}`}>
                      <Package size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-bold truncate ${m.ok ? "" : "text-gray-400"}`}>{m.n}</div>
                      <span
                        className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${m.ok ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400"}`}
                      >
                        {m.s}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[13px] font-bold" tabIndex={-1} aria-hidden>
                  Kunci Porsi & Pesan
                </button>
              </div>
            </div>

            <div className="hidden sm:flex absolute left-4 top-8 lg:left-6 items-center gap-2.5 rounded-xl bg-gray-900 text-white p-3 shadow-lg">
              <Clock className="text-orange-400" size={18} />
              <div className="text-[9px] leading-tight">
                <div className="text-gray-400">SISA WAKTU PENGUNCIAN</div>
                <b className={`text-sm text-emerald-400 ${MONO}`}>05:00</b>
              </div>
            </div>
            <div className="hidden sm:flex absolute right-4 bottom-8 lg:right-6 items-center gap-2.5 rounded-xl bg-white border border-emerald-200 p-3 shadow-lg">
              <MessageCircle className="text-emerald-500" size={22} />
              <div className="text-[10px] leading-tight">
                <b>Generator WhatsApp</b>
                <div className="text-gray-500">Kirim ke WA Penjual</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <Reveal>
            <dl className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-gray-200 bg-white shadow-sm divide-gray-100 lg:divide-x [&>div:nth-child(-n+2)]:border-b lg:[&>div]:border-b-0 [&>div]:border-gray-100">
              {STATS.map((s) => (
                <div key={s.l} className="p-5 sm:p-7">
                  <dd className={`text-[22px] sm:text-[28px] font-extrabold tracking-tight ${s.v === "05:00" ? `text-orange-600 ${MONO}` : ""}`}>{s.v}</dd>
                  <dt className="mt-1 text-[12px] sm:text-[13px] text-gray-500 leading-5">{s.l}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        {/* ================= MASALAH vs SOLUSI ================= */}
        <section id="masalah" className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-24 scroll-mt-20">
          <SectionHead
            tag="Kenapa KateringKita"
            title={
              <>
                Berhenti kecewa karena <span className="text-orange-600">stok yang salah.</span>
              </>
            }
            desc="Katalog WhatsApp manual tidak pernah tahu isi dapur. Akibatnya pembeli kecewa dan penjual kewalahan."
          />
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <Reveal>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-7 sm:p-8">
                <div className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Cara lama</div>
                <h3 className="mt-1 text-xl font-extrabold">Pesan lewat chat manual</h3>
                <ul className="mt-6 space-y-4">
                  {BEFORE.map((t) => (
                    <li key={t} className="flex gap-3 text-[14px] leading-6 text-gray-600">
                      <span className="mt-0.5 size-5 shrink-0 rounded-full bg-red-50 text-red-500 grid place-items-center">
                        <X size={12} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-2xl bg-gray-900 text-white p-7 sm:p-8 shadow-lg">
                <div className="text-[13px] font-bold text-orange-400 uppercase tracking-wide">Dengan KateringKita</div>
                <h3 className="mt-1 text-xl font-extrabold">Stok sinkron, pesanan pasti</h3>
                <ul className="mt-6 space-y-4">
                  {AFTER.map((t) => (
                    <li key={t} className="flex gap-3 text-[14px] leading-6 text-gray-300">
                      <span className="mt-0.5 size-5 shrink-0 rounded-full bg-emerald-500/15 text-emerald-400 grid place-items-center">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= FITUR (bento) ================= */}
        <section id="fitur" className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-24 scroll-mt-20">
          <SectionHead tag="Fitur utama" title="Semua yang dapur dan pembeli butuhkan." desc="Empat fitur inti yang saling terhubung, dari stok sampai laporan penjualan." />
          <div className="mt-10 grid lg:grid-cols-3 gap-5">
            {/* stok real-time */}
            <Reveal className="lg:col-span-2">
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-7 sm:p-8">
                <Tag>Stok Real-Time</Tag>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Habis di dapur, habis di katalog.</h3>
                <p className="mt-2 max-w-md text-[14px] leading-6 text-gray-500">Indikator stok otomatis berubah. Menu yang habis tidak bisa dipesan, jadi tidak ada lagi pembatalan sepihak.</p>
                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  {[
                    ["Nasi Box Ayam Bakar", "Tersedia 14 Porsi", true],
                    ["Snack Risoles", "Tersedia 6 Porsi", true],
                    ["Es Teh Manis", "Porsi Habis", false],
                  ].map(([n, s, ok]) => (
                    <div key={n as string} className={`rounded-xl border p-4 ${ok ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200 bg-slate-50"}`}>
                      <div className={`text-[13px] font-bold ${ok ? "" : "text-gray-400"}`}>{n}</div>
                      <div className={`mt-2 text-[12px] font-semibold ${ok ? "text-emerald-600" : "text-gray-400"}`}>{s}</div>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>

            {/* kunci porsi */}
            <Reveal delay={100}>
              <article className="h-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white p-7 sm:p-8 shadow-md">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase opacity-90">
                  <Lock size={14} />
                  Kunci Porsi
                </div>
                <div className={`mt-6 text-[56px] leading-none font-bold ${MONO}`}>05:00</div>
                <div className="mt-4 h-1.5 rounded-full bg-white/25 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-white" />
                </div>
                <p className="mt-4 text-[14px] leading-6 text-white/90">Porsi Anda ditahan 5 menit saat checkout. Lewat waktu, kunci dilepas untuk pembeli lain.</p>
              </article>
            </Reveal>

            {/* WhatsApp */}
            <Reveal>
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-7 sm:p-8">
                <Tag>Generator WhatsApp</Tag>
                <h3 className="mt-2 text-xl font-extrabold tracking-tight">Pesan tersusun otomatis.</h3>
                <div className="mt-5 rounded-xl rounded-tl-sm bg-emerald-50 border border-emerald-100 p-4 text-[12px] leading-5 text-gray-700">
                  <b>Halo, saya mau pesan:</b>
                  <br />
                  Nasi Box Ayam Bakar × 2<br />
                  Nama: Rafli
                  <br />
                  Alamat: Gedung A, Kampus
                </div>
                <div className="mt-3 inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-emerald-500 text-white text-[12px] font-bold">
                  <MessageCircle size={14} />
                  Kirim Pesanan ke WA Penjual
                </div>
              </article>
            </Reveal>

            {/* kelola */}
            <Reveal delay={100} className="lg:col-span-2">
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-7 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Tag>Kelola Menu & Riwayat</Tag>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Pantau toko dari satu dashboard.</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-emerald-50 border border-emerald-200 text-[12px] font-bold text-emerald-600">
                    <Store size={14} />
                    Buka Toko
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Hari Ini", "1 Minggu", "1 Bulan", "3 Bulan"].map((r, i) => (
                    <button
                      key={r}
                      onClick={() => setRange(i)}
                      aria-pressed={range === i}
                      className={`h-9 px-4 rounded-full text-[12px] font-semibold border transition ${range === i ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex items-end gap-2 sm:gap-3 h-28" aria-hidden>
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-orange-500 to-orange-400 transition-all duration-500"
                      style={{ height: `${h}%`, opacity: 0.55 + (i / bars.length) * 0.45 }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500">
                  <TrendingUp size={14} className="text-emerald-500" />
                  Contoh tampilan grafik penjualan
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* ================= CARA KERJA ================= */}
        <section id="cara-kerja" className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-24 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead tag="Cara kerja" title="Dua sisi, satu alur yang jelas." />
            <div role="tablist" className="inline-flex p-1 rounded-xl bg-slate-200/70 self-start">
              {(["pembeli", "pemilik"] as const).map((r) => (
                <button
                  key={r}
                  role="tab"
                  aria-selected={role === r}
                  onClick={() => setRole(r)}
                  className={`h-10 px-5 rounded-lg text-[14px] font-semibold transition ${role === r ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {r === "pembeli" ? "Pembeli" : "Pemilik Katering"}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[15px] text-gray-500">{F.desc}</p>
          <ol key={role} className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {F.steps.map(([t, d], i) => (
              <li
                key={t}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 animate-[stepin_500ms_cubic-bezier(.16,1,.3,1)_both] motion-reduce:animate-none"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className={`size-9 grid place-items-center rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[13px] font-bold ${MONO}`}>{i + 1}</span>
                <h3 className="mt-4 text-[16px] font-extrabold tracking-tight">{t}</h3>
                <p className="mt-2 text-[13px] leading-6 text-gray-500">{d}</p>
              </li>
            ))}
          </ol>
          <style>{`@keyframes stepin{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
        </section>

        {/* ================= CTA ================= */}
        <section id="kontak" className="max-w-[1280px] mx-auto px-5 sm:px-8 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white px-7 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="absolute -right-24 -top-24 size-80 rounded-full bg-orange-500/20 blur-3xl" aria-hidden />
              <div className="relative max-w-xl">
                <div className={`text-[11px] font-bold tracking-[0.18em] text-orange-400 uppercase ${MONO}`}>Mulai sekarang</div>
                <h2 className="mt-3 text-[32px] sm:text-[44px] leading-[1.1] font-extrabold tracking-tight">Siap buka dapur tanpa overbooking?</h2>
                <p className="mt-3 text-[15px] leading-7 text-gray-400">Daftarkan toko Anda, isi menu dan kuota, lalu biarkan stok bekerja untuk Anda.</p>
              </div>
              <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/register" className={btnPrimary}>
                  Daftar Akun Toko <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-white/25 text-white font-semibold text-[15px] hover:bg-white/10 transition">
                  Masuk / Login
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div className="max-w-xs">
            <Logo sub="Platform Operasi Katering Kampus & Acara" />
            <p className="mt-4 text-[13px] leading-6 text-gray-500">Aplikasi pemesanan katering dan produk danus dengan stok real-time, holding timer 5 menit, dan Generator WhatsApp.</p>
          </div>
          <nav aria-label="Area pembeli">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400">Pembeli</h4>
            <ul className="mt-4 space-y-3 text-[14px] text-gray-600">
              <li>Katalog & Beranda</li>
              <li>Detail Menu</li>
              <li>Checkout</li>
              <li>Generator WhatsApp</li>
            </ul>
          </nav>
          <nav aria-label="Area pemilik">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400">Pemilik</h4>
            <ul className="mt-4 space-y-3 text-[14px] text-gray-600">
              <li>Dashboard Utama</li>
              <li>Kelola Menu</li>
              <li>Riwayat Penjualan</li>
              <li>Pengaturan Akun</li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[50px] flex items-center justify-between text-[12px] text-gray-400">
            <span>
              <b className="text-gray-800 font-semibold mr-2">KateringKita</b>© 2026
            </span>
            <span className="hidden sm:block">Program Studi Teknologi Informasi, Universitas Brawijaya</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
