"use client";
import { useRef, useState } from "react";
import { Check, Send, Paperclip, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import { useStore } from "@/lib/store";

const mono = "font-[family-name:var(--font-mono)]";
const vars = ["{nama_toko}", "{nama_pemesan}", "{daftar_menu}", "{total_harga}", "{alamat}", "{booking_code}"];
const sample: Record<string, string> = {
  "{nama_toko}": "Dapur Barokah Katering",
  "{nama_pemesan}": "Rafli Ramadhan",
  "{daftar_menu}": "2× Nasi Ayam Bakar Madu\n1× Risol Mayo Lumer",
  "{total_harga}": "Rp 46.000",
  "{alamat}": "Gedung Vokasi Lt. 2",
  "{booking_code}": "#KK-98F1",
};
const tones = [
  ["Mahasiswa Ramah (Casual, Sopan & Cepat)", "Menggunakan sapaan santai ('Halo kak!', 'siap diantar kak'), responsif, dan persuasif."],
  ["Profesional Katering Resmi", "Bahasa baku, formal untuk pemesanan dinas, kantor fakultas, dan seminar formal."],
  ["Singkat & Padat To-the-point", "Hanya membalas ketersediaan stok, harga, dan link checkout tanpa basa-basi."],
];
const prompts = ["Bento katsu ada?", "Paket seminar 50 porsi", "Hari Jumat buka?"];

export default function TemplateWA() {
  const { menu } = useStore();
  const [tab, setTab] = useState(1);
  const [tpl, setTpl] = useState("");
  const [saved, setSaved] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const [tone, setTone] = useState(0);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([
    { me: true, t: "Halo kak, ayam bakar masih ada gak ya buat makan siang skrg? Bisa anter ke FIA Lt. 3?" },
    { me: false, t: "Halo kak! Masih ada banget kak, Nasi Ayam Bakar Madu Komplit sisa 6 porsi lagi di dapur. Bisa banget langsung diantar ke Gedung FIA Lt. 3 ya kak! 🚀" },
  ]);
  const [inp, setInp] = useState("");
  const flash = (k: string) => {
    setSaved(k);
    setTimeout(() => setSaved(""), 2000);
  };
  const insert = (v: string) => {
    const el = ta.current!;
    const s = el.selectionStart;
    setTpl(tpl.slice(0, s) + v + tpl.slice(el.selectionEnd));
    el.focus();
  };
  const preview = Object.entries(sample).reduce((a, [k, v]) => a.split(k).join(v), tpl);
  const reply = (q: string) => {
    const l = q.toLowerCase();
    const m = menu.find((x) => l.includes(x.name.split(" ")[1]?.toLowerCase() ?? "~") || l.includes(x.name.split(" ")[0].toLowerCase()));
    const body = m
      ? m.stock > 0
        ? `${m.name} masih ada ${m.stock} porsi, harga Rp ${m.price.toLocaleString("id-ID")}.`
        : `Maaf, ${m.name} sedang habis.`
      : l.includes("seminar") || l.includes("paket")
        ? "Paket acara min. 25 porsi, pre-order H-2, DP 50%, gratis ongkir kampus."
        : l.includes("buka") || l.includes("jam")
          ? "Dapur buka Senin-Jumat 07:00-16:00 WIB."
          : "Boleh dijelaskan lebih detail menu yang dicari?";
    return [tones[tone][0].startsWith("Mahasiswa") ? "Halo kak! " : "", body, tone === 1 ? " Terima kasih." : tone === 0 ? " 🚀" : "", " Kunci porsi (Holding 5 Mnt): kateringkita.com/menu"].join("");
  };
  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { me: true, t }, { me: false, t: reply(t) }]);
    setInp("");
  };
  const btn = (k: string, l: string) => (
    <button onClick={() => flash(k)} className="h-10 px-4 rounded-lg bg-gray-900 text-white text-[13px] font-semibold flex items-center gap-2">
      <Check size={14} />
      {saved === k ? "Tersimpan!" : l}
    </button>
  );
  const pill = <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">● AI RAG Engine Active (Gemini Flash)</span>;
  return (
    <Shell title="Template WhatsApp & AI RAG Bot" actions={pill}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold">WhatsApp Integration & AI RAG Auto-Reply</h1>
          <p className="text-[13px] text-gray-500 mt-1">Konfigurasi format pemesanan resmi dan Bot AI penjawab otomatis yang terhubung ke data stok live dapur.</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1 text-[13px]">
          {["1. Template Slip WA", "2. AI RAG Auto-Reply Bot"].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`px-4 py-1.5 rounded-md ${tab === i ? "bg-white font-bold shadow-sm" : "text-gray-500"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {tab === 0 ? (
        <div className="grid grid-cols-[1.15fr_1fr] gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="text-[11px] font-bold tracking-wider text-gray-500 mb-3">VARIABEL DINAMIS (KLIK UNTUK SISIPKAN):</div>
            <div className="flex flex-wrap gap-2">
              {vars.map((v) => (
                <button key={v} onClick={() => insert(v)} className={`border border-gray-200 rounded-md px-3 py-1.5 text-[12px] hover:bg-orange-50 ${mono}`}>
                  {v}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 mt-6 mb-3">STRUKTUR FORMAT PESAN</div>
            <textarea
              ref={ta}
              value={tpl}
              onChange={(e) => setTpl(e.target.value)}
              placeholder="Ketik atau sisipkan format template pesan WhatsApp di sini..."
              className={`w-full h-[290px] border border-gray-200 rounded-xl p-4 text-[13px] resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none ${mono}`}
            />
            <div className="flex justify-between items-center mt-4">
              <span className={`text-[11px] text-gray-400 ${mono}`}>Status: Sinkron Real-time</span>
              {btn("tpl", "Simpan Template")}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-gray-500 mb-3">PRATINJAU PESAN YANG DITERIMA PENJUAL:</div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 h-[470px] flex flex-col">
              <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[12px] font-bold">DB</div>
                <div>
                  <b className="text-[14px]">Dapur Barokah Katering</b>
                  <div className="text-[11px] opacity-80">Online · Layanan WhatsApp Resmi</div>
                </div>
              </div>
              <div className="flex-1 bg-[#efeae2] p-4">
                <div className="bg-white rounded-lg p-3 max-w-[260px] shadow-sm text-[13px] whitespace-pre-wrap min-h-[60px]">
                  {preview}
                  <div className="text-[10px] text-gray-400 text-right mt-2">
                    11:42 <span className="text-blue-500">✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-[15px]">
              Pengaturan RAG Knowledge Base{" "}
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1 ml-1">● AI Active (Gemini 1.5 Flash)</span>
            </h3>
            <p className="text-[13px] text-gray-500 mt-2 pb-5 border-b border-gray-100">
              Bot membaca data terkini secara otomatis dari database KateringKita sebelum membalas pertanyaan pembeli di WhatsApp.
            </p>
            <div className="flex justify-between items-center mt-5">
              <span className="text-[11px] font-bold tracking-wider text-gray-500">SUMBER DATA RAG YANG DISINKRONKAN</span>
              <span className={`text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-1 ${mono}`}>Realtime Sync</span>
            </div>
            {[
              [
                "Sisa Kuota & Menu Dapur Live",
                `Tahu sisa ayam bakar (${menu[0]?.stock ?? 0} porsi), risol (${menu[1]?.stock ?? 0} porsi), bento (${menu[3]?.stock ? menu[3].stock + " porsi" : "habis"})`,
              ],
              ["Jam Operasional Dapur", "Buka Senin-Jumat 07:00-16:00 WIB"],
              ["Aturan Paket Acara & Syarat DP", "Min. 25 porsi, pre-order H-2, DP 50%, free ongkir dalam kampus"],
            ].map(([a, b]) => (
              <div key={a} className="border border-gray-200 rounded-xl p-3 mt-3 flex justify-between items-center">
                <div>
                  <b className="text-[13px]">{a}</b>
                  <div className="text-[12px] text-gray-500 mt-1">{b}</div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 shrink-0 ml-3">✓ 100% Sync</span>
              </div>
            ))}
            <div className="text-[11px] font-bold tracking-wider text-gray-500 mt-6">TONE OF VOICE / GAYA BAHASA BOT:</div>
            {tones.map(([a, b], i) => (
              <button key={a} onClick={() => setTone(i)} className={`w-full text-left rounded-xl p-4 mt-3 flex gap-3 border ${tone === i ? "border-2 border-orange-500" : "border-gray-200"}`}>
                <span className={`w-5 h-5 rounded-full shrink-0 mt-0.5 ${tone === i ? "border-[6px] border-orange-600" : "border border-gray-300"}`} />
                <div className="flex-1">
                  <b className="text-[13px]">{a}</b>
                  <div className="text-[12px] text-gray-500 mt-1 leading-5">{b}</div>
                </div>
                {tone === i && <b className="text-[12px] text-orange-600">Aktif</b>}
              </button>
            ))}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => send("Cek RAG: stok ayam bakar?")} className="h-10 px-4 rounded-lg bg-gray-100 text-[13px] font-semibold">
                Uji Respon RAG
              </button>
              {btn("bot", "Simpan Konfigurasi Bot")}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold tracking-wider text-gray-500">SIMULATOR LIVE BOT WHATSAPP:</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">⚡ Responsif &lt;1 detik</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 flex flex-col h-[560px]">
              <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1">
                  <b className="text-[14px]">Dapur Barokah Bot Assistant (RAG)</b>
                  <div className="text-[11px] opacity-80">Menjawab otomatis &lt;1 detik • Gemini 1.5 Flash</div>
                </div>
                <button onClick={() => setMsgs([])} className="text-[11px] bg-white/15 rounded px-3 py-2">
                  Reset Chat
                </button>
              </div>
              <div className="flex-1 bg-[#efeae2] p-4 space-y-3 overflow-y-auto">
                {msgs.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-lg p-3 text-[13px] shadow-sm ${m.me ? "bg-white" : "bg-[#d9fdd3] ml-auto border border-emerald-200"}`}>
                    {!m.me && <div className="text-[9px] font-bold text-white bg-emerald-600 rounded px-2 py-1 w-fit mb-2">⚡ RAG ANSWER (LIVE DATA DAPUR)</div>}
                    {m.t}
                  </div>
                ))}
              </div>
              <div className="bg-white border-t border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto text-[11px] items-center">
                <span className="text-gray-400 shrink-0">Contoh Prompt Cepat:</span>
                {prompts.map((p) => (
                  <button key={p} onClick={() => send(p)} className="border border-gray-200 rounded-full px-3 py-1 shrink-0 hover:bg-gray-50">
                    "{p}"
                  </button>
                ))}
              </div>
              <div className="bg-white p-3 flex items-center gap-2 border-t border-gray-100">
                <Paperclip size={16} className="text-gray-400" />
                <input
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(inp)}
                  placeholder="Ketik pertanyaan untuk simulasi Bot..."
                  className="flex-1 h-9 border border-gray-200 rounded-full px-4 text-[13px] outline-none"
                />
                <button onClick={() => send(inp)} className="w-10 h-10 rounded-full bg-[#075e54] text-white flex items-center justify-center">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
