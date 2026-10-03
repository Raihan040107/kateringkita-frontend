"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Volume2, VolumeX, FileText, ArrowRight, MessageCircle, MapPin, Flame, Check, ChevronRight, BookOpen, Receipt, Store } from "lucide-react";
import Shell from "@/components/Shell";
import { useStore, rp } from "@/lib/store";

const mono = "font-[family-name:var(--font-mono)]";
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const tag = (m: { stock: number }) =>
  m.stock === 0
    ? ["Habis", "bg-red-50 text-red-600 border-red-200"]
    : m.stock <= 3
      ? ["Menipis", "bg-orange-50 text-orange-700 border-orange-200"]
      : ["Aman", "bg-emerald-50 text-emerald-700 border-emerald-200"];

export default function DashboardLive() {
  const { menu, orders, adj, setStatus, addOrder } = useStore();
  const [tab, setTab] = useState("Semua");
  const [q, setQ] = useState("");
  const [sound, setSound] = useState(true);
  const [detail, setDetail] = useState<string[]>([]);
  const active = orders.filter((o) => o.status === "holding" || o.status === "masak");
  const omzet = 1825000 + orders.filter((o) => o.status === "selesai").reduce((a, o) => a + o.total, 0);
  const holds = orders.filter((o) => o.status === "holding");
  const list = orders.filter(
    (o) => (tab === "Semua" || (tab === "Holding" && o.status === "holding") || (tab === "Masak" && o.status === "masak")) && (o.id + o.name).toLowerCase().includes(q.toLowerCase()),
  );
  const wa = (p: string) => window.open("https://wa.me/62" + p.replace(/\D/g, "").slice(1), "_blank");

  const actions = (
    <>
      <div className="hidden lg:flex items-center gap-2 w-[420px] h-8 border border-gray-200 rounded-lg px-3 text-[13px] mr-6">
        <Search size={14} className="text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari #KK-... atau nama pemesan..." className="flex-1 outline-none bg-transparent" />
        <span className={`text-[10px] text-gray-400 border rounded px-1.5 ${mono}`}>Ctrl+K</span>
      </div>
      <button onClick={addOrder} className="h-8 px-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 text-[13px] font-medium flex items-center gap-1.5">
        <Plus size={14} />
        Simulasi Order
      </button>
      <button
        onClick={() => setSound(!sound)}
        className={`h-8 w-8 rounded-lg border flex items-center justify-center ${sound ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-gray-200 text-gray-400"}`}
      >
        {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>
      <Link href="/template-wa" className="h-8 px-3 rounded-lg bg-orange-600 text-white text-[13px] font-semibold flex items-center gap-1.5">
        <FileText size={14} />
        Slip Order <ArrowRight size={13} />
      </Link>
    </>
  );
  return (
    <Shell title="Dashboard Live Antrean" actions={actions}>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400">OMSET HARI INI</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5">+18.4%</span>
          </div>
          <div className="text-2xl font-extrabold mt-3">{rp(omzet)}</div>
          <div className="text-[12px] text-gray-500 mt-2">Terverifikasi dari {13 + orders.filter((o) => o.status === "selesai").length} transaksi lunas</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400">KAPASITAS MASAK</span>
            <span className={`text-[11px] ${mono}`}>92/120 Porsi</span>
          </div>
          <div className="text-2xl font-extrabold mt-3">76.6%</div>
          <div className="h-1.5 rounded-full bg-gray-100 mt-3">
            <div className="h-full w-[76.6%] rounded-full bg-orange-600" />
          </div>
        </div>
        <div className="bg-white border-2 border-amber-400 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500">
              <i className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-1" />
              DI-HOLD 5 MENIT
            </span>
            <span className={`text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 ${mono}`}>Redis TTL</span>
          </div>
          <div className="text-2xl font-extrabold mt-3">{holds.length} Pesanan</div>
          <div className="text-[12px] text-gray-500 mt-2">{menu.reduce((a, m) => a + m.hold, 0)} porsi terkunci sementara di dapur</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400">RATA-RATA MASAK</span>
            <span className={`text-[10px] text-gray-500 ${mono}`}>SLA: 17 Menit</span>
          </div>
          <div className="text-2xl font-extrabold mt-3">14 Menit</div>
          <div className="text-[12px] text-emerald-600 mt-2 flex gap-1">
            <Check size={13} />3 menit lebih cepat dari batas SLA dapur
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-5 mt-5 items-start">
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 h-[50px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <Receipt size={17} className="text-orange-600" />
              ANTREAN PESANAN MASUK<span className="text-[11px] bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{active.length} Aktif</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5 text-[12px]">
              {["Semua", "Holding", "Masak"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-md ${tab === t ? "bg-white font-semibold shadow-sm" : "text-gray-500"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {list.map((o) =>
            o.status === "selesai" || o.status === "batal" ? (
              <div key={o.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold">
                    {o.id} <span className="text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 ml-1">{o.status === "batal" ? "BATAL" : "SELESAI"}</span>
                  </span>
                  <span className={`text-[11px] text-gray-400 ${mono}`}>{o.time} WIB</span>
                </div>
                <div className="flex justify-between text-[13px] mt-2">
                  <span>
                    {o.name} • {o.items.join(", ")}
                  </span>
                  <b>{rp(o.total)}</b>
                </div>
              </div>
            ) : (
              <div key={o.id} className={`bg-white rounded-xl overflow-hidden ${o.status === "holding" ? "border-2 border-orange-500" : "border border-gray-200"}`}>
                <div className="flex justify-between items-center px-4 h-12 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-[13px] font-bold">
                    {o.id}
                    {o.status === "holding" ? (
                      <span className="text-[11px] bg-amber-100 text-amber-800 rounded px-2 py-1">HOLDING {fmt(o.left)}</span>
                    ) : (
                      <span className="text-[11px] bg-orange-50 text-orange-700 border border-orange-200 rounded px-2 py-1 flex items-center gap-1">
                        <Flame size={11} />
                        DIMASAK
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] text-gray-400 ${mono}`}>{o.time} WIB</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold text-[15px]">
                        {o.name} <span className="text-[12px] font-normal text-gray-400 ml-1">{o.phone}</span>
                      </div>
                      <div className="mt-2 text-[13px]">
                        {o.items.map((i) => (
                          <div key={i}>
                            <span className="text-gray-400">{i.split("× ")[0]}×</span> {i.split("× ")[1]}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">TOTAL</div>
                      <div className="font-bold text-[16px]">
                        {rp(o.total)}{" "}
                        {o.status === "masak" && <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 ml-1">Terkonfirmasi</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-600 mt-3">
                    <MapPin size={13} className="text-orange-600" />
                    {o.loc}
                  </div>
                  {o.note && <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[12px] italic text-amber-900">“{o.note}”</div>}
                  {detail.includes(o.id) && (
                    <div className={`mt-3 text-[12px] bg-gray-50 rounded-lg p-3 ${mono}`}>
                      Slip {o.id} · {o.items.join(" + ")} · Total {rp(o.total)} · {o.loc}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="text-[12px] text-gray-500">
                      {o.status === "holding" && (
                        <button onClick={() => setStatus(o.id, "batal")} className="underline mr-4">
                          Simulasi Timeout 5m
                        </button>
                      )}
                      <button onClick={() => setDetail(detail.includes(o.id) ? detail.filter((d) => d !== o.id) : [...detail, o.id])} className="font-bold text-gray-800">
                        {o.status === "holding" ? "Detail Slip →" : "Lihat Slip →"}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => wa(o.phone)} className="h-8 px-3 border border-emerald-500 text-emerald-700 rounded-lg text-[12px] font-semibold flex items-center gap-1.5">
                        <MessageCircle size={13} />
                        Chat WA
                      </button>
                      {o.status === "holding" ? (
                        <button onClick={() => setStatus(o.id, "masak")} className="h-8 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[12px] font-bold">
                          Masak
                        </button>
                      ) : (
                        <button onClick={() => setStatus(o.id, "selesai")} className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-bold">
                          Selesai
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
          {!list.length && <div className="text-center text-[13px] text-gray-400 py-10">Tidak ada pesanan.</div>}
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center px-4 h-12 border-b border-gray-100">
              <span className="flex items-center gap-2 text-[13px] font-bold">
                <Store size={16} className="text-gray-500" />
                KUOTA PORSI DAPUR
              </span>
              <Link href="/menu" className="text-[12px] font-semibold text-orange-600">
                Kelola Semua →
              </Link>
            </div>
            {menu.map((m) => {
              const [t, c] = tag(m);
              return (
                <div key={m.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[13px] font-semibold">
                      <span className="truncate max-w-[170px]">{m.name}</span>
                      <span className={`text-[10px] font-bold border rounded px-1.5 shrink-0 ${c}`}>{t}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Sisa <b className={m.stock === 0 ? "text-red-600" : "text-gray-900"}>{m.stock}</b> • Hold {m.hold} • Terjual {m.sold}
                    </div>
                  </div>
                  {m.stock === 0 ? (
                    <button onClick={() => adj(m.id, 10)} className="h-8 px-3 border border-gray-200 rounded-lg text-[12px] font-semibold hover:bg-gray-50">
                      +10 Porsi
                    </button>
                  ) : (
                    <div className="flex items-center border border-gray-200 rounded-lg h-8 text-[13px] font-semibold">
                      <button onClick={() => adj(m.id, -1)} className="px-2 text-gray-500 hover:text-gray-900">
                        −
                      </button>
                      <span className={`px-2 ${mono}`}>{m.stock}</span>
                      <button onClick={() => adj(m.id, 1)} className="w-7 h-full bg-orange-600 hover:bg-orange-700 text-white rounded-r-lg">
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="px-4 py-3 text-[11px] text-emerald-700">
              <i className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
              Sinkron otomatis via WebSocket ke aplikasi pembeli
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-[#1c1917] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-[13px] font-bold">i</div>
              <div>
                <div className="text-[13px] font-bold">Ringkasan Operasional Dapur</div>
                <div className="text-[10px] text-gray-400">Metrik Katering & Akses Cepat</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-[9px] font-semibold tracking-wider text-gray-400">MENU TERLARIS</div>
                <div className="text-[13px] font-bold mt-2">Ayam Bakar Madu</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">42 Box Terjual</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-[9px] font-semibold tracking-wider text-gray-400">RATA-RATA MASAK</div>
                <div className="text-[13px] font-bold mt-2">15 Menit</div>
                <div className="text-[11px] text-gray-400 mt-1">Sesuai SLA</div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {(
                [
                  [BookOpen, "Kelola Menu & Stok Kuota", "/menu"],
                  [Receipt, "Kalkulator Food Cost & Margin", "/copilot"],
                  [MessageCircle, "Template WA & Auto-Reply", "/template-wa"],
                ] as const
              ).map(([Ic, l, h]) => (
                <Link key={l} href={h} className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 h-10 text-[13px] font-semibold hover:bg-gray-50">
                  <Ic size={15} className="text-orange-600" />
                  <span className="flex-1">{l}</span>
                  <ChevronRight size={15} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
