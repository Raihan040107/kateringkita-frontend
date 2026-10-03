"use client";
import { useState } from "react";
import { Layers, Utensils, Wand2, Store, Clock, Check } from "lucide-react";
import Shell from "@/components/Shell";

const modes = [
  {
    k: "Makan Siang Harian",
    I: Utensils,
    d: "Khusus melayani porsi satuan makan siang fresh mahasiswa/dosen dengan antrean live & holding 5 menit.",
    f: "Retail Dapur · Fast Cook",
    c: "text-orange-600",
  },
  {
    k: "Paket Acara & Seminar",
    I: Wand2,
    d: "Pemesanan partai besar konsumsi rapat, seminar kampus, dan makrab (Min. 25 porsi) dengan H-2 pre-order.",
    f: "Pre-Order Box · Acara Kampus",
    c: "text-purple-600",
  },
  { k: "Layanan Terpadu", I: Store, d: "Mengaktifkan kedua katalog untuk memaksimalkan omzet makan siang harian dan pesanan besar kampus.", f: "Harian + Pre-Order Acara", c: "text-emerald-700" },
];
export default function Pengaturan() {
  const [mode, setMode] = useState("Layanan Terpadu");
  const [nama, setNama] = useState("Dapur Barokah Katering");
  const [wa, setWa] = useState("081234567890");
  const [alamat, setAlamat] = useState("Kantin Gedung Vokasi Lt. 1, Universitas Brawijaya");
  const [buka, setBuka] = useState("07:00");
  const [tutup, setTutup] = useState("16:00");
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const inp = "w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] focus:ring-2 focus:ring-orange-500 focus:outline-none";
  const lbl = "block text-[10px] font-bold tracking-wider text-gray-500 mb-2 mt-4";
  return (
    <Shell
      title="Pengaturan Toko & Operasional Dapur"
      actions={
        <button onClick={save} className="h-8 px-3 rounded-lg bg-orange-600 text-white text-[13px] font-semibold">
          {saved ? "✓ Tersimpan" : "Simpan Perubahan"}
        </button>
      }
    >
      <h1 className="text-[22px] font-extrabold">Pengaturan Toko & Layanan Katering Dapur</h1>
      <p className="text-[13px] text-gray-500 mt-1 mb-5">Sinkronisasi data profil dapur, nomor WhatsApp tujuan order, mode layanan, dan durasi penguncian porsi.</p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Layers size={17} />
            </div>
            <div>
              <div className="text-[13px] font-bold">
                KARAKTERISTIK LAYANAN DAPUR <span className="font-normal text-gray-400 text-[11px]">(Pilih salah satu model operasional)</span>
              </div>
              <div className="text-[12px] text-gray-500">Tentukan arsitektur katalog, batas order, dan alur kerja dapur katering</div>
            </div>
          </div>
          <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            ● {mode === "Layanan Terpadu" ? "Layanan Terpadu (Harian & Acara)" : mode}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {modes.map(({ k, I, d, f, c }) => {
            const a = mode === k;
            return (
              <button key={k} onClick={() => setMode(k)} className={`text-left rounded-xl p-4 border-2 transition ${a ? "border-emerald-500 bg-white" : "border-gray-200 hover:border-gray-300"}`}>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[14px] font-bold">
                    <I size={16} className={c} />
                    {k}
                  </span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${a ? "bg-emerald-500 text-white" : "border border-gray-300"}`}>
                    {a && <Check size={12} strokeWidth={3} />}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 leading-5 mt-3 min-h-[60px]">{d}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className={`text-[12px] font-semibold ${c}`}>{f}</span>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 rounded px-2 py-1">{a ? "Sedang Aktif ✓" : "Pilih Mode"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-[13px] font-bold pb-3 border-b border-gray-100">
            <Store size={15} className="text-orange-600" />
            PROFIL TOKO / STAND
          </div>
          <label className={lbl}>NAMA USAHA / STAND KATERING</label>
          <input className={inp} value={nama} onChange={(e) => setNama(e.target.value)} />
          <label className={lbl}>NOMOR WHATSAPP TUJUAN ORDER</label>
          <div className="flex">
            <span className="h-10 px-3 flex items-center bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-[13px] text-gray-500">+62</span>
            <input className={inp + " rounded-l-none"} value={wa} onChange={(e) => setWa(e.target.value.replace(/\D/g, ""))} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Format tanpa awalan 0/62 untuk generator link otomatis WA.</p>
          <label className={lbl}>ALAMAT / LOKASI DAPUR DI KAMPUS</label>
          <input className={inp} value={alamat} onChange={(e) => setAlamat(e.target.value)} />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-[13px] font-bold pb-3 border-b border-gray-100">
            <Clock size={15} className="text-orange-600" />
            JAM OPERASIONAL & KEBIJAKAN LOCK
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>JAM BUKA DAPUR</label>
              <input type="time" className={inp} value={buka} onChange={(e) => setBuka(e.target.value)} />
            </div>
            <div>
              <label className={lbl}>JAM TUTUP DAPUR</label>
              <input type="time" className={inp} value={tutup} onChange={(e) => setTutup(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex justify-between">
              <b className="text-[13px] text-amber-900">● Durasi Holding Lock Porsi</b>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 rounded px-2 py-1">300 Detik (5 Mnt)</span>
            </div>
            <p className="text-[12px] text-amber-800 leading-5 mt-2">
              Standar Redis Lua Script TTL 5 Menit mengunci stok di dapur secara atomic saat pembeli membuka link checkout WA. Jika batas waktu habis tanpa konfirmasi bayar, porsi otomatis
              dikembalikan ke dapur (zero overbooking).
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={save} className="h-10 px-5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold flex items-center gap-2">
              <Check size={14} />
              {saved ? "Tersimpan!" : "Simpan Perubahan Pengaturan"}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
