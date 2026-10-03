"use client";
import { useState } from "react";
import Link from "next/link";
import { Target, Calendar, RefreshCw, ChefHat, Check } from "lucide-react";
import Shell from "@/components/Shell";
import { rp } from "@/lib/store";

const mono = "font-[family-name:var(--font-mono)]";
const tabs = [
  ["1. Target Omzet & Porsi Harian", Target],
  ["2. Paket Acara & Event (Bulk Pre-Order)", Calendar],
  ["3. Rekonsiliasi Tutup Dapur Sisa Porsi", RefreshCw],
] as const;
const inp = "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-3 text-[14px] font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none";
const lbl = "block text-[10px] font-bold tracking-wider text-gray-500 mb-2";
const N = (v: string) => +v.replace(/\D/g, "") || 0;

export default function Copilot() {
  const [tab, setTab] = useState(0);
  const [omzet, setOmzet] = useState("2000000");
  const [hari, setHari] = useState(5);
  const [hpp, setHpp] = useState("9500");
  const [jual, setJual] = useState("15000");
  const [buf, setBuf] = useState(5);
  const [applied, setApplied] = useState(false);
  const margin = N(jual) - N(hpp),
    laba = N(omzet) * 0.2,
    base = margin > 0 ? Math.ceil(laba / margin) : 0,
    extra = Math.ceil((base * buf) / 100),
    porsi = base + extra;
  const [qty, setQty] = useState(60);
  const [eh, setEh] = useState("18000");
  const [ej, setEj] = useState("29000");
  const [ongkir, setOngkir] = useState(false);
  const [box, setBox] = useState(false);
  const add = box ? 1500 * qty : 0,
    total = qty * N(ej) + add,
    cost = qty * N(eh),
    profit = total - cost - add;
  const [sold, setSold] = useState("116");
  const [aksi, setAksi] = useState("Diskon Flash Sale Sore (Habis Terbantu)");
  const [cat, setCat] = useState("Hujan lebat jam 13:30 di area fakultas teknik menyebabkan 4 box ayam bakar tersisa.");
  const [done, setDone] = useState(false);
  const s = Math.min(120, N(sold)),
    sisa = 120 - s,
    rugi = sisa * 9500,
    omz = s * 25000;
  const Sel = ({ v, set, o }: { v: any; set: (x: any) => void; o: [any, string][] }) => (
    <select value={v} onChange={(e) => set(isNaN(+e.target.value) ? e.target.value : +e.target.value)} className={inp}>
      {o.map(([a, b]) => (
        <option key={b} value={a}>
          {b}
        </option>
      ))}
    </select>
  );
  const rupiah = (v: string, set: (x: string) => void, c = "") => (
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400 text-[13px]">Rp</span>
      <input className={`${inp} pl-9 ${mono} ${c}`} value={v} onChange={(e) => set(e.target.value.replace(/\D/g, ""))} />
    </div>
  );
  return (
    <Shell
      title="Copilot HPP & Simulator Porsi Dapur"
      actions={<span className="text-[12px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">✦ AI Copilot Engine Active</span>}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold">AI Copilot Kalkulator HPP & Simulasi Porsi</h1>
          <p className="text-[13px] text-gray-500 mt-1">Hitung target omzet, efisiensi food cost HPP bahan baku, simulasi paket partai besar, dan rebalancing porsi sisa.</p>
        </div>
        <Link href="/menu" className="h-9 px-4 rounded-full bg-white border border-gray-200 text-[13px] font-semibold flex items-center">
          Buka Kelola Menu →
        </Link>
      </div>
      <div className="bg-slate-100 border border-gray-200 rounded-2xl p-2 grid grid-cols-3 gap-2 mb-5">
        {tabs.map(([t, I], i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 ${tab === i ? "bg-orange-600 text-white shadow" : "text-gray-600 hover:bg-white/60"}`}
          >
            <I size={14} />
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid grid-cols-[1.35fr_1fr] gap-6 items-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                <Target size={18} />
              </div>
              <div>
                <b>Parameter Finansial & Operasional</b>
                <div className="text-[12px] text-gray-500">Sesuaikan target pendapatan, jadwal masak, dan modal bahan baku</div>
              </div>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr] gap-4">
              <div>
                <label className={lbl}>TARGET PENDAPATAN / OMZET HARIAN (IDR)</label>
                {rupiah(omzet, setOmzet)}
              </div>
              <div>
                <label className={lbl}>JADWAL MASAK AKTIF PER MINGGU</label>
                <Sel
                  v={hari}
                  set={setHari}
                  o={[
                    [5, "5 Hari Penuh (Senin s/d Jumat)"],
                    [6, "6 Hari (Senin s/d Sabtu)"],
                    [7, "7 Hari Penuh"],
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div>
                <label className={lbl}>HPP / FOOD COST BAHAN</label>
                {rupiah(hpp, setHpp)}
              </div>
              <div>
                <label className={lbl}>RENCANA HARGA JUAL</label>
                {rupiah(jual, setJual, "text-orange-600")}
              </div>
              <div>
                <label className={lbl}>BUFFER SISA / RISIKO</label>
                <Sel
                  v={buf}
                  set={setBuf}
                  o={[
                    [0, "0% (Ketat)"],
                    [5, "5% (Aman)"],
                    [10, "10% (Longgar)"],
                  ]}
                />
              </div>
            </div>
            <div className="mt-5 bg-orange-50 border border-orange-100 rounded-xl p-4 text-[13px] text-orange-900">
              ⓘ Formula kalkulator memperhitungkan buffer fluktuasi agar target pendapatan kas selalu terproteksi aman.
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                <ChefHat size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-gray-600">KUOTA REKOMENDASI HARIAN:</div>
                <b className="text-[22px]">{porsi} Porsi</b>{" "}
                <span className="text-[12px] font-bold text-orange-600">
                  ({base} + {extra} buffer)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              {[
                ["TARGET LABA HARIAN:", rp(laba) + " / hari", ""],
                ["MARGIN KEUNTUNGAN:", `${rp(margin)} (${N(jual) ? ((margin / N(jual)) * 100).toFixed(1) : 0}%)`, "text-emerald-700"],
                ["ESTIMASI MODAL BAHAN:", rp(porsi * N(hpp) * hari), ""],
                ["PROYEKSI LABA BERSIH:", `${rp(porsi * margin * hari)} (${laba ? (((porsi * margin) / laba) * 100).toFixed(1) : 0}%)`, "text-emerald-700"],
              ].map(([a, b, c]) => (
                <div key={a} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="text-[9px] font-bold tracking-wider text-gray-400">{a}</div>
                  <div className={`text-[13px] font-bold mt-1 ${c}`}>{b}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setApplied(true)} className="w-full h-12 mt-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-[14px]">
              {applied ? "✓ Kuota & Target Diterapkan" : "Terapkan Kuota & Target ke Menu Dapur →"}
            </button>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid grid-cols-[1.45fr_1fr] gap-6 items-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <b className="text-[15px]">PARAMETER FINANSIAL & OPERASIONAL PESANAN</b>
            <div className="flex justify-between mt-6 mb-2">
              <label className="text-[12px] font-bold">
                1. Jumlah Porsi / Box Catering <span className="font-normal text-gray-400">(Min. 25 porsi)</span>
              </label>
              <b className={`text-[11px] text-orange-600 ${mono}`}>Qty: {qty} Box</b>
            </div>
            <input type="number" min={25} value={qty} onChange={(e) => setQty(Math.max(0, +e.target.value))} className={inp} />
            <div className="flex gap-2 mt-3">
              {[25, 50, 60, 100, 200].map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className={`h-8 px-3 rounded-lg text-[12px] font-semibold ${qty === n ? "bg-orange-600 text-white" : "bg-gray-50 border border-gray-200 text-gray-600"}`}
                >
                  {n} Porsi{qty === n && " Aktif"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-[12px] font-bold mb-2">2. HPP Bahan Pokok Grosir / Box</label>
                {rupiah(eh, setEh)}
              </div>
              <div>
                <label className="block text-[12px] font-bold mb-2">3. Rencana Harga Penawaran ke Panitia</label>
                {rupiah(ej, setEj, "text-orange-600")}
              </div>
            </div>
            <label className="block text-[12px] font-bold mt-6 mb-2">5. Biaya Tambahan Operasional (Add-ons)</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Ongkir Kampus Internal", "Gratis (Rp 0)", ongkir, () => setOngkir(!ongkir)],
                ["Box Bento Eksklusif", "Rp 1.500 / box", box, () => setBox(!box)],
              ].map(([a, b, on, f]: any) => (
                <button key={a} onClick={f} className={`text-left rounded-xl p-3 flex justify-between items-center border ${on ? "border-emerald-400 bg-emerald-50/40" : "border-gray-200"}`}>
                  <div>
                    <b className="text-[13px]">{a}</b>
                    <div className="text-[11px] text-gray-500">{b}</div>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] ${on ? "bg-emerald-500 text-white" : "bg-gray-200"}`}>{on ? <Check size={12} /> : "+"}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <b className="text-[14px]">● KALKULASI INVOICE & MARGIN</b>
            <div className="border border-gray-200 rounded-2xl p-5 mt-4">
              <div className="text-[11px] font-bold tracking-wider text-gray-500">TOTAL NILAI TAGIHAN KE PANITIA</div>
              <div className={`text-[30px] font-extrabold mt-2 ${mono}`}>{rp(total)}</div>
              <div className="grid grid-cols-2 gap-3 mt-3 bg-gray-50 rounded-xl p-3 text-[11px]">
                <div>
                  <span className="text-gray-500">Biaya Pokok Bahan:</span>
                  <div className={`font-bold text-[13px] ${mono}`}>{rp(cost)}</div>
                </div>
                <div>
                  <span className="text-emerald-700">Laba Bersih Katering:</span>
                  <div className={`font-bold text-[13px] text-emerald-700 ${mono}`}>
                    +{rp(profit)} ({total ? ((profit / total) * 100).toFixed(1) : 0}%)
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[12px] space-y-2">
              <b className="text-[13px]">SKEMA DP 50% (ANTI-CANCEL)</b>
              <div className="flex justify-between">
                Syarat DP Masuk ke Kasir: <b className={mono}>{rp(total / 2)}</b>
              </div>
              <div className="flex justify-between">
                Alokasi Belanja Bahan Grosir: <b className={mono}>{rp(cost)}</b>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-2">
                Sisa Pelunasan Hari-H: <b className={`text-orange-600 ${mono}`}>{rp(total / 2)}</b>
              </div>
            </div>
            <Link href="/menu" className="mt-5 w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-[13px] flex items-center justify-center">
              Simpan sebagai Paket Menu Acara di Katalog
            </Link>
            <button
              onClick={() => navigator.clipboard?.writeText(`Penawaran ${qty} box @ ${rp(N(ej))} = ${rp(total)}. DP 50%: ${rp(total / 2)}`)}
              className="mt-2 w-full h-12 rounded-xl bg-gray-100 text-[13px] font-semibold"
            >
              Unduh Invoice Penawaran PDF / Salin Draft WA Panitia
            </button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="grid grid-cols-[1.45fr_1fr] gap-6 items-start">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between">
              <div>
                <div className="text-[11px] text-gray-400 tracking-wider">REALISASI LAPANGAN</div>
                <b className="text-[17px]">Perhitungan Fisik Box Katering</b>
              </div>
              <span className={`text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 h-7 flex items-center ${mono}`}>
                ● {((s / 120) * 100).toFixed(1)}% Efisiensi
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[12px] text-gray-500">Kuota Masak</div>
                <b className={`text-[22px] ${mono}`}>120</b>
                <div className="text-[10px] text-gray-400">Porsi Terjadwal</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-[12px] font-bold text-emerald-800">Porsi Terjual</div>
                <input
                  value={sold}
                  onChange={(e) => setSold(e.target.value.replace(/\D/g, ""))}
                  className={`w-16 h-9 border border-gray-300 rounded-lg text-center font-bold text-[18px] ${mono} mt-1`}
                />{" "}
                <b className="text-[12px]">Porsi</b>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="text-[12px] font-bold text-orange-800">Porsi Sisa</div>
                <b className="text-[20px] text-orange-700">{sisa} Porsi</b>
                <div className="text-[10px] text-orange-600">{((sisa / 120) * 100).toFixed(1)}% dari total masak</div>
              </div>
            </div>
            <label className="block text-[12px] font-bold mt-6 mb-2">Penanganan Porsi Sisa Hari Ini</label>
            <Sel v={aksi} set={setAksi} o={["Diskon Flash Sale Sore (Habis Terbantu)", "Donasi / Bagikan ke Komunitas", "Olah Ulang untuk Menu Besok"].map((x) => [x, x] as [string, string])} />
            <div className="flex justify-between mt-5 mb-2">
              <label className="text-[12px] font-bold">Catatan Evaluasi Dapur & Faktor Eksternal</label>
              <span className="text-[11px] text-gray-400">Penting untuk training AI</span>
            </div>
            <textarea
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 text-[13px] resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <b className={`bg-gray-100 border border-gray-200 rounded px-2 py-2 ${mono}`}>
                {s}/{sisa}
              </b>
              <div className="text-[12px] w-48">
                <b>Rasio Distribusi Batch Siang</b>
                <div className="text-gray-500">Target porsi tercapai {s} box @ Rp 25.000</div>
              </div>
              <div className="flex-1 h-2 rounded-full bg-orange-500 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(s / 120) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">🤖</div>
              <div>
                <b className="text-[14px]">AI Adaptive Rebalancing</b>
                <div className={`text-[10px] text-gray-400 ${mono}`}>KateringKita Copilot Engine</div>
              </div>
            </div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 mt-5 mb-3">RINGKASAN DAMPAK FINANSIAL HARI INI</div>
            <div className="space-y-2">
              {[
                ["Omzet Masuk Hari Ini", rp(omz), "bg-gray-50"],
                ["HPP Porsi Sisa (Potensi Defisit)", "-" + rp(rugi), "bg-orange-50 text-red-600"],
                ["Realisasi Laba Bersih", rp(omz - s * 9500), "bg-emerald-50"],
              ].map(([a, b, c]) => (
                <div key={a} className={`${c.split(" ")[0]} rounded-xl p-3 flex justify-between text-[12px]`}>
                  <span className="text-gray-800">{a}</span>
                  <b className={`${mono} ${c.split(" ")[1] ?? ""}`}>{b}</b>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <b className="text-[12px] text-orange-700">✦ KOMPENSASI KUOTA ESOK HARI</b>
              <div className="bg-white rounded-xl p-3 mt-3">
                <div className="text-[11px] text-gray-500">Rekomendasi Kuota Masak Besok:</div>
                <b className={`text-[22px] ${mono}`}>
                  {120 - sisa - 2} – {120 - sisa + 8} Porsi
                </b>{" "}
                <span className="text-[11px] font-bold bg-orange-100 text-orange-700 rounded px-2 py-1">+{sisa} Porsi Kompensasi</span>
              </div>
            </div>
            <button onClick={() => setDone(true)} className="w-full h-12 mt-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-[13px]">
              {done ? "✓ Kas Tersimpan & Kuota Besok Diterapkan" : "Simpan Tutup Kas & Terapkan Kuota Besok"}
            </button>
            <button onClick={() => window.print()} className="w-full h-11 mt-2 rounded-xl bg-gray-100 text-[13px] font-semibold">
              Cetak Rekap Tutup Dapur (Slip Kasir)
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
