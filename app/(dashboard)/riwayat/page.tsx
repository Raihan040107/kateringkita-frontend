"use client";
import { Download } from "lucide-react";
import Shell from "@/components/Shell";
import { rp } from "@/lib/store";

const mono = "font-[family-name:var(--font-mono)]";
const rows = [
  ["11:15", "#KK-77C9", "Budi Santoso", "Retail Kantin", "3× Es Teh Solo Jumbo", 15000, "Lunas", 7500],
  ["10:45", "#KK-65D4", "Panitia Seminar Nasional", "Event Acara Kampus", "50× Paket Bento Acara", 1250000, "Lunas", 450000],
  ["10:10", "#KK-54E3", "Dewi Lestari", "Retail Takeaway", "4× Risol Mayo Lumer", 40000, "Lunas", 14000],
  ["09:30", "#KK-43F2", "Himpunan TI (Makrab)", "Event Organisasi", "35× Paket Bento Acara", 875000, "DP 50%", 315000],
  ["08:45", "#KK-32A1", "Farhan Maulana", "Retail Dine-in", "2× Nasi Ayam Bakar Madu", 90000, "Lunas", 30000],
] as const;
const pts = [3, 10, 18, 48, 65, 41, 14];
const X = (i: number) => 60 + i * 115,
  Y = (v: number) => 215 - v * 2.9;
const path = pts
  .map((v, i) => {
    if (!i) return `M${X(0)},${Y(v)}`;
    const cx = (X(i - 1) + X(i)) / 2;
    return `C${cx},${Y(pts[i - 1])} ${cx},${Y(v)} ${X(i)},${Y(v)}`;
  })
  .join(" ");

export default function Riwayat() {
  const csv = () => {
    const t = "Waktu,Kode,Pemesan,Tipe,Detail,Total,Status,Laba Bersih\n" + rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" }));
    a.download = "laporan-keuangan.csv";
    a.click();
  };
  const btn = (
    <button onClick={csv} className="h-8 px-3 rounded-lg border border-gray-200 text-[13px] font-medium flex items-center gap-1.5">
      <Download size={14} />
      Unduh Laporan (CSV)
    </button>
  );
  const total = rows.reduce((a, r) => a + r[5], 0);
  return (
    <Shell title="Riwayat Pesanan & Laporan Keuangan" actions={btn}>
      <h1 className="text-[22px] font-extrabold">Riwayat Penjualan & Laporan Finansial Dapur</h1>
      <p className="text-[13px] text-gray-500 mt-1 mb-5">Rekap transaksi otomatis, margin keuntungan bersih, dan pembukuan pesanan katering.</p>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
        <div className="flex justify-between gap-8">
          <div className="max-w-[300px]">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1">RINGKASAN OPERASIONAL & KEUANGAN</span>
            <h2 className="text-[20px] font-extrabold mt-3">Dapur Barokah Katering</h2>
            <p className="text-[12px] text-gray-500 mt-2">Akumulasi pendapatan bersih, modal HPP bahan, dan realisasi penjualan harian.</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-3 gap-4">
            {[
              ["TARGET OMZET", "5.000.000", ""],
              ["REALISASI", "2.270.000", "text-emerald-700"],
              ["TOTAL HPP", "1.453.500", ""],
            ].map(([l, v, c]) => (
              <div key={l}>
                <div className="text-[10px] text-gray-400 font-semibold">{l}</div>
                <div className="mt-1 text-gray-400 text-[12px]">
                  Rp <b className={`text-[18px] text-gray-900 ${mono} ${c}`}>{v}</b>
                </div>
              </div>
            ))}
            <div>
              <div className="text-[10px] text-emerald-700 font-semibold">LABA BERSIH</div>
              <div className="mt-1 text-gray-400 text-[12px]">
                Rp <b className={`text-[18px] ${mono} text-emerald-700`}>816.500</b>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-[12px] mt-5 pt-4 border-t border-gray-100">
          <span className="text-gray-500">Pencapaian Target:</span>
          <span className={mono}>
            <b className="text-orange-600">40.8% Tercapai</b> <span className="text-gray-400">(Sisa Rp 1.183.500)</span>
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-2">
          <div className="h-full w-[40.8%] rounded-full bg-gradient-to-r from-orange-600 to-orange-500" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
        <div className="flex justify-between">
          <b className="text-[13px]">
            <i className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" />
            KURVA PUNCAK PENJUALAN (LUNCH RUSH)
          </b>
          <span className={`text-[11px] bg-gray-100 border border-gray-200 rounded px-2 py-1 ${mono}`}>11:00 - 14:00 WIB</span>
        </div>
        <svg viewBox="0 0 800 260" className="w-full mt-4">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f97316" stopOpacity=".18" />
              <stop offset="1" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 10, 20, 30, 40, 50, 60, 70].map((v) => (
            <g key={v}>
              <line x1="50" x2="790" y1={Y(v)} y2={Y(v)} stroke="#e5e7eb" />
              <text x="40" y={Y(v) + 3} fontSize="9" textAnchor="end" fill="#9ca3af">
                {v}
              </text>
            </g>
          ))}
          <path d={`${path} L${X(6)},${Y(0)} L${X(0)},${Y(0)}Z`} fill="url(#g)" />
          <path d={path} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          {pts.map((v, i) => (
            <g key={i}>
              <circle cx={X(i)} cy={Y(v)} r="4.5" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
              <text x={X(i)} y="245" fontSize="9" textAnchor="middle" fill="#9ca3af">
                {String(8 + i).padStart(2, "0")}:00
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 h-12 border-b border-gray-100 text-[13px]">
          <b>BUKU BESAR TRANSAKSI SELESAI</b>
          <span className="text-gray-400 text-[12px]">Akuntansi Terverifikasi</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[10px] tracking-wider text-gray-400 text-left">
              {["WAKTU", "KODE", "PEMESAN", "DETAIL MENU", "TOTAL", "STATUS", "LABA BERSIH"].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[1]} className="border-t border-gray-100">
                <td className={`px-5 py-3 text-gray-400 text-[12px] ${mono}`}>{r[0]} WIB</td>
                <td className={`px-5 font-bold ${mono}`}>{r[1]}</td>
                <td className="px-5">
                  <b>{r[2]}</b>
                  <div className="text-[10px] text-orange-600 border border-orange-200 bg-orange-50 rounded px-1.5 inline-block mt-1 ml-0 block w-fit">{r[3]}</div>
                </td>
                <td className="px-5">{r[4]}</td>
                <td className={`px-5 font-bold ${mono}`}>{rp(r[5])}</td>
                <td className="px-5">
                  <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 ${r[6] === "Lunas" ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{r[6]}</span>
                </td>
                <td className={`px-5 text-right font-bold text-emerald-700 ${mono}`}>+{rp(r[7])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500 text-right">
          Total transaksi tercatat: <b className="text-gray-900">{rp(total)}</b>
        </div>
      </div>
    </Shell>
  );
}
