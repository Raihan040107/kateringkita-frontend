"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { HelpCircle, Lock, MessageCircle, TrendingUp } from "lucide-react";
import { getMerchantTypes } from "@/services/authService";
import { MerchantType, RegisterPayload } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import { fontClass } from "@/lib/fonts";
import { NAME_RE, PHONE_MAX, onlyDigits, validateEmail, validatePhone } from "@/lib/validators";

/* ---------- validasi form register ---------- */
type Errors = Partial<Record<keyof RegisterPayload, string>>;
const ORDER: (keyof RegisterPayload)[] = ["nama_lengkap", "no_whatsapp", "email", "nama_usaha", "type_id", "alamat_usaha", "password", "confirm_password"];

function validateRegister(f: RegisterPayload): Errors {
  const e: Errors = {};
  const nama = f.nama_lengkap.trim();
  if (!nama) e.nama_lengkap = "Nama pemilik wajib diisi.";
  else if (nama.length < 3) e.nama_lengkap = "Nama minimal 3 karakter.";
  else if (!NAME_RE.test(nama)) e.nama_lengkap = "Nama hanya boleh berisi huruf dan spasi.";

  const wa = validatePhone(f.no_whatsapp);
  if (wa) e.no_whatsapp = wa;

  const em = validateEmail(f.email ?? "", true);
  if (em) e.email = em;

  const usaha = f.nama_usaha.trim();
  if (!usaha) e.nama_usaha = "Nama usaha wajib diisi.";
  else if (usaha.length < 3) e.nama_usaha = "Nama usaha minimal 3 karakter.";

  if (!Number(f.type_id)) e.type_id = "Pilih jenis usaha.";

  const alamat = f.alamat_usaha.trim();
  if (!alamat) e.alamat_usaha = "Alamat usaha wajib diisi.";
  else if (alamat.length < 10) e.alamat_usaha = "Alamat terlalu singkat, tulis minimal 10 karakter.";

  if (!f.password) e.password = "Password wajib diisi.";
  else if (f.password.length < 8) e.password = "Password minimal 8 karakter.";
  else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.password = "Password harus mengandung huruf dan angka.";

  if (!f.confirm_password) e.confirm_password = "Konfirmasi password wajib diisi.";
  else if (f.confirm_password !== f.password) e.confirm_password = "Konfirmasi tidak sama dengan password.";
  return e;
}

/* ---------- pembungkus field: label + pesan error/hint ---------- */
function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold mb-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[12px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function RegisterPage() {
  // ===== LOGIKA (tidak diubah) =====
  const [types, setTypes] = useState<MerchantType[]>([]);
  const { handleRegister, loading, error } = useAuth();

  const [formData, setFormData] = useState<RegisterPayload>({
    nama_lengkap: "",
    no_whatsapp: "",
    email: "",
    nama_usaha: "",
    alamat_usaha: "",
    type_id: 0,
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    getMerchantTypes()
      .then(setTypes)
      .catch(() => alert("Gagal memuat jenis usaha"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // =================================

  // ===== VALIDASI =====
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterPayload, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => validateRegister(formData), [formData]);
  const err = (n: keyof RegisterPayload) => (touched[n] || submitted ? errors[n] : undefined);
  const blur = (n: keyof RegisterPayload) => () => setTouched((t) => ({ ...t, [n]: true }));

  // nomor WhatsApp: hanya angka, maksimal 13 digit
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, no_whatsapp: onlyDigits(e.target.value).slice(0, PHONE_MAX) });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = ORDER.find((k) => errors[k]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    handleRegister({
      ...formData,
      nama_lengkap: formData.nama_lengkap.trim(),
      no_whatsapp: formData.no_whatsapp.trim(),
      email: (formData.email ?? "").trim(),
      nama_usaha: formData.nama_usaha.trim(),
      alamat_usaha: formData.alamat_usaha.trim(),
    });
  };

  const inp = (n: keyof RegisterPayload) =>
    `w-full h-12 bg-slate-50 border rounded-xl px-4 text-[14px] focus:ring-2 focus:outline-none ${err(n) ? "border-red-300 bg-red-50/40 focus:ring-red-400" : "border-gray-200 focus:ring-orange-500"}`;
  const aria = (n: keyof RegisterPayload, hint?: boolean) => ({
    "aria-invalid": !!err(n),
    "aria-describedby": err(n) ? `${n}-err` : hint ? `${n}-hint` : undefined,
  });

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
          <div className="text-[11px] font-bold tracking-[0.18em] text-orange-600 font-[family-name:var(--font-mono)]">PENDAFTARAN MERCHANT BARU</div>
          <h2 className="mt-2 text-[30px] font-extrabold tracking-tight">Daftar Merchant</h2>
          <p className="mt-2 text-[14px] leading-6 text-gray-500">Buat akun untuk mengelola stok harian, live antrean kantin, dan laporan keuangan stand katering Anda.</p>

          {error && (
            <div role="alert" className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Field id="nama_lengkap" label="Nama Pemilik *" error={err("nama_lengkap")}>
              <input
                id="nama_lengkap"
                type="text"
                name="nama_lengkap"
                autoComplete="name"
                maxLength={60}
                value={formData.nama_lengkap}
                onChange={handleChange}
                onBlur={blur("nama_lengkap")}
                placeholder="Contoh: Siska Rahmawati"
                className={inp("nama_lengkap")}
                {...aria("nama_lengkap")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3 items-start">
              <Field id="no_whatsapp" label="No WhatsApp *" error={err("no_whatsapp")} hint="10–13 digit, diawali 08">
                <input
                  id="no_whatsapp"
                  type="tel"
                  name="no_whatsapp"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={PHONE_MAX}
                  value={formData.no_whatsapp}
                  onChange={handlePhone}
                  onBlur={blur("no_whatsapp")}
                  placeholder="08123456789"
                  className={inp("no_whatsapp")}
                  {...aria("no_whatsapp", true)}
                />
              </Field>
              <Field id="email" label="Email (opsional)" error={err("email")}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={100}
                  value={formData.email ?? ""}
                  onChange={handleChange}
                  onBlur={blur("email")}
                  placeholder="nama@email.com"
                  className={inp("email")}
                  {...aria("email")}
                />
              </Field>
            </div>

            <Field id="nama_usaha" label="Nama Usaha *" error={err("nama_usaha")}>
              <input
                id="nama_usaha"
                type="text"
                name="nama_usaha"
                maxLength={80}
                value={formData.nama_usaha}
                onChange={handleChange}
                onBlur={blur("nama_usaha")}
                placeholder="Contoh: Dapur Barokah"
                className={inp("nama_usaha")}
                {...aria("nama_usaha")}
              />
            </Field>

            <Field id="type_id" label="Jenis Usaha *" error={err("type_id")}>
              <select id="type_id" name="type_id" value={formData.type_id || ""} onChange={handleChange} onBlur={blur("type_id")} className={inp("type_id")} {...aria("type_id")}>
                <option value="">-- Pilih Jenis Usaha --</option>
                {types.map((item) => (
                  <option key={item.type_id} value={item.type_id}>
                    {item.nama_jenis}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="alamat_usaha" label="Alamat Usaha *" error={err("alamat_usaha")}>
              <textarea
                id="alamat_usaha"
                name="alamat_usaha"
                rows={2}
                maxLength={200}
                value={formData.alamat_usaha}
                onChange={handleChange}
                onBlur={blur("alamat_usaha")}
                placeholder="Jalan, nomor, kelurahan, kota"
                className={inp("alamat_usaha") + " h-auto py-3 resize-none"}
                {...aria("alamat_usaha")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3 items-start">
              <Field id="password" label="Password *" error={err("password")} hint="Min. 8 karakter, huruf & angka">
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={blur("password")}
                  placeholder="Buat password"
                  className={inp("password")}
                  {...aria("password", true)}
                />
              </Field>
              <Field id="confirm_password" label="Konfirmasi *" error={err("confirm_password")}>
                <input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  autoComplete="new-password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={blur("confirm_password")}
                  placeholder="Ulangi password"
                  className={inp("confirm_password")}
                  {...aria("confirm_password")}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-white font-bold text-[15px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
            <Link href="/login" className="flex items-center justify-center w-full h-12 rounded-xl bg-slate-100 text-gray-600 font-semibold text-[15px] hover:bg-slate-200 transition">
              Masuk
            </Link>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-[13px] text-gray-500">
            sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-orange-600">
              Masuk ke Akun Merchant
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
