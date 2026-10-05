"use client";
import { useRef, useState } from "react";
import { Search, Pencil, Trash2, ArrowLeft, UploadCloud, Clock, ShoppingCart, Calculator, ShieldCheck, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";
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

const fcats: [string, string, string][] = [
  ["Nasi Box", "Nasi Box", "Makan Siang Fresh"],
  ["Snack", "Snack", "Kudapan & Kue"],
  ["Minuman", "Minuman", "Es Teh / Kopi"],
  ["Paket Custom", "Paket Event", "Bulk Pre-Order H-2"],
];
const N = (v: string) => +v.replace(/\D/g, "") || 0;
const inp = "w-full h-11 bg-white border border-gray-200 rounded-xl px-3 text-[14px] focus:ring-2 focus:ring-orange-500 focus:outline-none";
const lbl = "block text-[13px] font-bold mb-2";
const card = "bg-white border border-gray-200 rounded-2xl p-6";

function FormView({ cur, onClose }: { cur?: Menu; onClose: () => void }) {
  const { menu, setMenu } = useStore();
  const [name, setName] = useState(cur?.name ?? "");
  const [cat, setCat] = useState(cur?.cat ?? "Nasi Box");
  const [desc, setDesc] = useState((cur as any)?.desc ?? "");
  const [img, setImg] = useState(cur?.img ?? "/menu/1.png");
  const [hpp, setHpp] = useState(String(cur?.hpp ?? ""));
  const [price, setPrice] = useState(String(cur?.price ?? ""));
  const [stock, setStock] = useState(String(cur?.stock ?? ""));
  const [est, setEst] = useState(cur?.est ?? "15 Mnt");
  const [err, setErr] = useState("");
  const file = useRef<HTMLInputElement>(null);

  const p = N(price),
    h = N(hpp),
    q = N(stock),
    gross = p - h;
  const mg = p ? (gross / p) * 100 : 0,
    omzet = q * p,
    modal = q * h,
    laba = omzet - modal,
    ratio = p ? (h / p) * 100 : 0;
  const st = mg < 30 ? ["Margin Tipis", "bg-red-50 text-red-600"] : mg > 45 ? ["Margin Tinggi", "bg-blue-50 text-blue-700"] : ["Ideal & Sehat", "bg-emerald-100 text-emerald-700"];
  const catLabel = fcats.find((c) => c[0] === cat)?.[1];
  const mid = cur ? String(cur.id).slice(-3).padStart(3, "0") : String(menu.length + 1).padStart(3, "0");

  const save = () => {
    if (!name.trim() || !p) return setErr("Nama menu dan harga jual wajib diisi.");
    const v = { name: name.trim(), cat, desc, img, price: p, hpp: h, stock: q, est };
    setMenu(cur ? menu.map((m) => (m.id === cur.id ? { ...m, ...v } : m)) : [...menu, { ...v, id: Date.now(), hold: 0, sold: 0 } as Menu]);
    onClose();
  };
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImg(URL.createObjectURL(f));
  };
  const acts = (
    <>
      <button onClick={onClose} className="h-8 px-3 rounded-lg border border-gray-200 text-[13px] font-medium inline-flex items-center gap-1.5">
        <ArrowLeft size={14} />
        Kembali ke Katalog
      </button>
      <button onClick={save} className="h-8 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold">
        Publikasikan Menu
      </button>
    </>
  );

  return (
    <Shell title={`Kelola Menu & Stok › ${cur ? "Edit Menu" : "Tambah Menu Baru"}`} actions={acts}>
      <span className="inline-block text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 mb-3">
        ● Formulir {cur ? "Edit" : "Tambah"} Menu Dapur • 05_form_tambah_menu
      </span>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Formulir {cur ? "Edit" : "Tambah"} Menu & Alokasi Porsi</h1>
          <p className="text-[13px] text-gray-500 mt-1 max-w-[560px]">
            Daftarkan item katering baru, atur kuota produksi harian, proteksi holding lock Redis 5 menit, dan kalibrasi HPP margin keuntungan.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="h-10 px-5 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold inline-flex items-center">
            ✕ Batal
          </button>
          <button onClick={save} className="h-10 px-7 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[14px] font-bold">
            Simpan
          </button>
        </div>
      </div>
      {err && <div className="mb-4 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-[13px]">{err}</div>}

      <div className="grid grid-cols-[1.5fr_1fr] gap-6 items-start">
        <div className="space-y-6">
          <div className={card}>
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center">1</span>
                <div>
                  <b className="text-[15px]">Informasi Dasar & Kategori Menu</b>
                  <div className="text-[11px] text-gray-500 max-w-[330px]">Identitas makanan yang ditampilkan pada WhatsApp bot & portal pembeli</div>
                </div>
              </div>
              <span className={`text-[10px] bg-gray-100 rounded px-2 py-1.5 text-gray-600 ${mono}`}>ID Auto: #MN-{mid}</span>
            </div>
            <div className="flex justify-between mt-5 mb-2">
              <label className="text-[13px] font-bold">
                Nama Menu Katering <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] text-gray-400 ${mono}`}>{name.length}/60</span>
            </div>
            <input className={inp} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Nasi Ayam Bakar Madu Spesial Vokasi" />
            <label className={lbl + " mt-5"}>
              Kategori Menu <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {fcats.map(([v, l, s]) => (
                <button key={v} onClick={() => setCat(v)} className={`text-left rounded-xl p-3 flex gap-2 items-start border-2 ${cat === v ? "border-orange-500 bg-orange-50/40" : "border-gray-200"}`}>
                  <span className={`w-4 h-4 mt-0.5 rounded-full shrink-0 ${cat === v ? "border-[5px] border-orange-600" : "border border-gray-300"}`} />
                  <span>
                    <b className="block text-[13px]">{l}</b>
                    <span className="text-[10px] text-gray-500">{s}</span>
                  </span>
                </button>
              ))}
            </div>
            <label className={lbl + " mt-5"}>Deskripsi & Komposisi Menu</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Nasi pulen wangi, ayam paha bakar madu karamel, lalap timun kemangi..."
              className="w-full border border-gray-200 rounded-xl p-3 text-[13px] resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <div className="flex justify-between mt-5 mb-2">
              <label className="text-[13px] font-bold">Foto Menu Katering</label>
              <span className="text-[11px] text-gray-400">Format JPG/PNG, rasio 4:3, maks 5MB</span>
            </div>
            <div className="border-2 border-dashed border-orange-300 bg-orange-50/30 rounded-2xl p-4 flex items-center gap-4">
              {img ? <img src={img} alt="" className="w-[88px] h-[72px] rounded-lg object-cover" /> : <div className="w-[88px] h-[72px] rounded-lg bg-gray-100" />}
              <div className="flex-1">
                <div className="flex gap-3 items-center">
                  <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
                  <button onClick={() => file.current?.click()} className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold inline-flex items-center gap-2">
                    <UploadCloud size={15} className="text-orange-600" />
                    {img ? "Ganti Foto" : "Unggah Foto"}
                  </button>
                  {img && (
                    <button onClick={() => setImg("")} className="text-[13px] font-semibold text-red-500 inline-flex items-center gap-1.5">
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-gray-500 mt-2">Foto asli menggugah selera meningkatkan konversi pesanan hingga 48% di WhatsApp.</p>
              </div>
            </div>
          </div>

          <div className={card}>
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">2</span>
                <div>
                  <b className="text-[15px]">Penetapan Harga & HPP Bahan Baku (Food Cost)</b>
                  <div className="text-[11px] text-gray-500">Hitung modal belanja per porsi agar laba bersih terproteksi otomatis</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 shrink-0 inline-flex items-center gap-1">
                <ShieldCheck size={13} />
                Proteksi Margin 30-45%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className={lbl}>
                  Modal HPP Bahan Baku / Box <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-[13px]">Rp</span>
                  <input className={`${inp} pl-9 font-bold ${mono}`} value={hpp} onChange={(e) => setHpp(e.target.value.replace(/\D/g, ""))} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Biaya beras, ayam potong, minyak, rempah & kemasan kraft.</p>
              </div>
              <div>
                <label className={lbl}>
                  Harga Jual ke Pembeli / Box <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-[13px]">Rp</span>
                  <input className={`${inp} pl-9 font-bold ${mono}`} value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Harga resmi di invoice WhatsApp & menu kantin kampus.</p>
              </div>
            </div>
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp size={16} />
              </span>
              <div className="flex-1 text-[12px] text-gray-600">
                Estimasi Gross Profit per Box:
                <div className={`font-bold text-[14px] ${gross < 0 ? "text-red-600" : "text-emerald-700"} ${mono}`}>
                  {gross < 0 ? "-" : "+"}
                  {rp(Math.abs(gross))} / porsi <span className="font-normal text-gray-500">({mg.toFixed(1)}% Gross Margin)</span>
                </div>
              </div>
              <span className={`text-[11px] font-bold rounded-lg px-3 py-1.5 ${st[1]}`}>Status: {st[0]}</span>
            </div>
          </div>

          <div className={card}>
            <div className="flex gap-3 pb-4 border-b border-gray-100">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">3</span>
              <div>
                <b className="text-[15px]">Alokasi Porsi & Waktu Masak</b>
                <div className="text-[11px] text-gray-500">Kuota dikunci otomatis (holding lock Redis 5 menit) saat pembeli checkout</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <label className={lbl}>Kuota Produksi Harian (Box)</label>
                <input className={`${inp} font-bold ${mono}`} value={stock} onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))} />
              </div>
              <div>
                <label className={lbl}>
                  <Clock size={13} className="inline mr-1" />
                  Estimasi Waktu Masak
                </label>
                <select className={inp} value={est} onChange={(e) => setEst(e.target.value)}>
                  {["5 Mnt", "10 Mnt", "15 Mnt", "20 Mnt", "Pre-Order H-2"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={card}>
            <div className="flex justify-between items-center mb-4">
              <b className="text-[13px]">
                <i className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" />
                LIVE PREVIEW DI KATALOG TOKO
              </b>
              <span className="text-[10px] text-gray-400">Tampilan Pembeli</span>
            </div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="relative h-[190px] bg-gray-100">
                {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                <span className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[10px] font-bold bg-orange-600 text-white rounded px-2 py-1">{catLabel}</span>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white rounded px-2 py-1">✓ Ready {q} Box</span>
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/70 text-white rounded px-2 py-1">◷ SLA: {est}</span>
              </div>
              <div className="p-4">
                <b className="text-[15px] block">{name || "Nama menu belum diisi"}</b>
                <p className="text-[12px] text-gray-500 mt-1 line-clamp-2 min-h-[36px]">{desc || "Deskripsi menu akan tampil di sini."}</p>
                <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-400">Harga per Pax</div>
                    <b className={`text-[18px] text-orange-600 ${mono}`}>{rp(p)}</b>
                  </div>
                  <span className="h-9 px-4 rounded-lg bg-orange-600 text-white text-[12px] font-bold inline-flex items-center gap-1.5">
                    <ShoppingCart size={13} />
                    Pesan WA
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3 text-[12px] text-gray-600 flex gap-2">
              <MessageCircle size={16} className="text-emerald-500 shrink-0" />
              Bot AI RAG akan otomatis menjawab pertanyaan ketersediaan menu ini secara real-time.
            </div>
          </div>
          <div className={card}>
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <Calculator size={16} className="text-gray-500 mt-0.5" />
                <div>
                  <b className="text-[13px]">PROYEKSI FINANSIAL KUOTA INI</b>
                  <div className="text-[11px] text-gray-500">Perhitungan jika {q} box habis terjual hari ini</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-1">AI Verified</span>
            </div>
            <div className="mt-4 space-y-3 text-[12px] pb-4 border-b border-dashed border-gray-300">
              <div className="flex justify-between">
                <span>
                  Potensi Omzet Kotor ({q} Box @ {rp(p)}):
                </span>
                <b className={mono}>{rp(omzet)}</b>
              </div>
              <div className="flex justify-between">
                <span>
                  Alokasi Modal Belanja ({q} Box @ {rp(h)}):
                </span>
                <b className={`text-red-500 ${mono}`}>-{rp(modal)}</b>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <b className="text-[13px]">Proyeksi Laba Bersih Dapur:</b>
                <div className="text-[11px] text-emerald-700 font-semibold">Margin Keuntungan {mg.toFixed(1)}%</div>
              </div>
              <b className={`text-[20px] ${laba < 0 ? "text-red-600" : "text-emerald-700"} ${mono}`}>
                {laba < 0 ? "-" : "+"}
                {rp(Math.abs(laba))}
              </b>
            </div>
            <div className="flex justify-between text-[11px] mt-4 mb-1.5">
              <span className="text-gray-600">Rasio Food Cost (HPP / Jual)</span>
              <b className={`${ratio < 70 ? "text-emerald-700" : "text-red-600"} ${mono}`}>{ratio.toFixed(1)}% (Batas Aman &lt; 70%)</b>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${ratio < 70 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, ratio)}%` }} />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-[12px] text-amber-900 leading-5">
            <b className="text-[13px] flex items-center gap-1.5 mb-1">
              <Lightbulb size={14} className="text-orange-500" />
              Tips Dapur Katering Kampus
            </b>
            Memasang kuota porsi harian secara presisi melindungi modal dapur dari sisa makanan (food waste). Bila sore hari bersisa, gunakan fitur <i>Rekonsiliasi Tutup Dapur</i> di Copilot HPP untuk
            otomatisasi diskon flash sale.
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function MenuPage() {
  const { menu, setMenu, adj } = useStore();
  const [q, setQ] = useState("");
  const [f, setF] = useState("Semua");
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const rows = menu.filter((m) => (f === "Semua" || m.cat === f) && m.name.toLowerCase().includes(q.toLowerCase()));
  const add = (
    <button onClick={() => setEditing("new")} className="inline-flex items-center h-8 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold">
      + Tambah Menu Baru →
    </button>
  );
  if (editing !== null) return <FormView key={String(editing)} cur={menu.find((m) => m.id === editing)} onClose={() => setEditing(null)} />;
  return (
    <Shell title="Kelola Menu & Stok">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold">Katalog Menu & Alokasi Porsi</h1>
          <p className="text-[13px] text-gray-500 mt-1">Kelola daftar makanan katering, harga per pax, estimasi waktu masak, dan proteksi holding porsi.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center h-9 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold">
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
                      <button onClick={() => setEditing(m.id)} className="hover:text-orange-600">
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
    </Shell>
  );
}
