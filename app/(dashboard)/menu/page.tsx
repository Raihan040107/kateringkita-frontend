"use client";
import { useState } from "react";
import { Search, Pencil, Trash2, X } from "lucide-react";
import Shell from "@/components/Shell";
import { useStore, rp, Menu } from "@/lib/store";

const mono = "font-[family-name:var(--font-mono)]";
const cats = ["Nasi Box", "Snack", "Minuman", "Paket Custom"];
const cc: Record<string, string> = {
  "Nasi Box": "bg-orange-50 text-orange-700",
  Snack: "bg-amber-50 text-amber-700",
  Minuman: "bg-blue-50 text-blue-700",
  "Paket Custom": "bg-purple-50 text-purple-700",
};
type F = { id?: number; name: string; cat: string; price: string; hpp: string; stock: string };

export default function MenuPage() {
  const { menu, setMenu, adj } = useStore();
  const [q, setQ] = useState("");
  const [f, setF] = useState("Semua");
  const [form, setForm] = useState<F | null>(null);
  const rows = menu.filter((m) => (f === "Semua" || m.cat === f) && m.name.toLowerCase().includes(q.toLowerCase()));
  const blank: F = { name: "", cat: "Nasi Box", price: "", hpp: "", stock: "" };
  const save = () => {
    if (!form || !form.name || !form.price) return;
    const v = { name: form.name, cat: form.cat, price: +form.price, hpp: +form.hpp || 0, stock: +form.stock || 0 };
    setMenu(form.id ? menu.map((m) => (m.id === form.id ? { ...m, ...v } : m)) : [...menu, { ...v, id: Date.now(), hold: 0, sold: 0, est: "15 Mnt", img: "/menu/1.png" } as Menu]);
    setForm(null);
  };
  const add = (
    <button onClick={() => setForm(blank)} className="h-8 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold">
      + Tambah Menu Baru →
    </button>
  );
  const inp = "w-full border border-gray-200 rounded-lg h-10 px-3 text-[13px] focus:ring-2 focus:ring-orange-500 focus:outline-none";
  return (
    <Shell title="Kelola Menu & Stok" actions={add}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold">Katalog Menu & Alokasi Porsi</h1>
          <p className="text-[13px] text-gray-500 mt-1">Kelola daftar makanan katering, harga per pax, estimasi waktu masak, dan proteksi holding porsi.</p>
        </div>
        <button onClick={() => setForm(blank)} className="h-9 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold">
          + Tambah Menu Baru
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 w-[320px] h-9 border border-gray-200 rounded-lg px-3">
          <Search size={14} className="text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama menu katering..." className="flex-1 text-[13px] outline-none" />
        </div>
        <div className="flex gap-1 text-[13px]">
          {["Semua", ...cats].map((t) => (
            <button key={t} onClick={() => setF(t)} className={`px-4 h-8 rounded-full font-medium ${f === t ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[10px] tracking-wider text-gray-400 text-left border-b border-gray-100">
              {["FOTO & NAMA MENU", "KATEGORI", "HARGA JUAL", "SISA KUOTA DAPUR", "EST. MASAK", "STATUS KETERSEDIAAN", "AKSI"].map((h) => (
                <th key={h} className="p-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const mg = m.price - m.hpp;
              return (
                <tr key={m.id} className="border-b border-gray-100 last:border-0">
                  <td className="p-4">
                    <div className="flex gap-3 items-center">
                      <img src={m.img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold max-w-[240px]">{m.name}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          ID: #MN-{String(m.id).slice(-3).padStart(3, "0")} · Terjual: {m.sold} ·{" "}
                          <b className="text-emerald-700">
                            Margin: {rp(mg)} ({Math.round((mg / m.price) * 100)}%)
                          </b>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[11px] font-semibold rounded px-2 py-1 ${cc[m.cat]}`}>{m.cat}</span>
                  </td>
                  <td className="p-4">
                    <b className={mono}>{rp(m.price)}</b>
                    <div className={`text-[10px] text-gray-400 ${mono}`}>HPP Modal: {rp(m.hpp)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => adj(m.id, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200">
                        −
                      </button>
                      <b className={`w-8 text-center ${mono} ${m.stock === 0 ? "text-red-500" : "text-emerald-700"}`}>{m.stock}</b>
                      <button onClick={() => adj(m.id, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200">
                        +
                      </button>
                      {m.hold > 0 && <span className="text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded px-1.5 py-1">{m.hold} Hold</span>}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{m.est}</td>
                  <td className="p-4">
                    {m.stock === 0 ? (
                      <span className="text-[11px] font-bold bg-red-50 text-red-600 rounded-full px-3 py-1">✕ HABIS</span>
                    ) : (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-full px-3 py-1">●● AKTIF</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 text-gray-400">
                      <button onClick={() => setForm({ id: m.id, name: m.name, cat: m.cat, price: String(m.price), hpp: String(m.hpp), stock: String(m.stock) })} className="hover:text-orange-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => confirm(`Hapus "${m.name}"?`) && setMenu(menu.filter((x) => x.id !== m.id))} className="hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && <div className="text-center text-gray-400 text-[13px] py-10">Menu tidak ditemukan.</div>}
      </div>
      {form && (
        <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center" onClick={() => setForm(null)}>
          <div className="bg-white rounded-2xl w-[440px] p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-[17px]">{form.id ? "Edit Menu" : "Tambah Menu Baru"}</h3>
              <button onClick={() => setForm(null)}>
                <X size={18} />
              </button>
            </div>
            <input className={inp} placeholder="Nama menu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className={inp} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input className={inp} type="number" placeholder="Harga jual" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className={inp} type="number" placeholder="HPP" value={form.hpp} onChange={(e) => setForm({ ...form, hpp: e.target.value })} />
              <input className={inp} type="number" placeholder="Kuota" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <button onClick={save} className="w-full h-10 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[14px]">
              Simpan
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
