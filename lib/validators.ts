// lib/validators.ts — validasi bersama untuk halaman login & register

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_MIN = 10;
export const PHONE_MAX = 13;
export const NAME_RE = /^[\p{L}][\p{L}\s.'-]*$/u; // huruf, spasi, titik, apostrof, strip

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Validasi nomor WhatsApp Indonesia: hanya angka, diawali 08, 10–13 digit. */
export function validatePhone(v: string): string | undefined {
  const s = v.trim();
  if (!s) return "Nomor WhatsApp wajib diisi.";
  if (/\D/.test(s)) return "Nomor hanya boleh berisi angka.";
  if (!s.startsWith("08")) return "Nomor harus diawali 08, contoh: 08123456789.";
  if (s.length < PHONE_MIN || s.length > PHONE_MAX) return `Nomor harus ${PHONE_MIN}–${PHONE_MAX} digit (sekarang ${s.length} digit).`;
  return undefined;
}

/** Validasi email. Jika optional dan kosong, dianggap valid. */
export function validateEmail(v: string, optional = false): string | undefined {
  const s = v.trim();
  if (!s) return optional ? undefined : "Email wajib diisi.";
  if (!EMAIL_RE.test(s)) return "Format email tidak valid, contoh: user@mail.com.";
  return undefined;
}

/** Login menerima nomor ATAU email. Jika ada "@" diperlakukan sebagai email. */
export function validateIdentifier(v: string): string | undefined {
  const s = v.trim();
  if (!s) return "Nomor WhatsApp atau email wajib diisi.";
  return s.includes("@") ? validateEmail(s) : validatePhone(s);
}
