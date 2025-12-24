import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET!;

/**
 * 🔁 Determinístico → usar para CHAVES
 */
export function hashKey(value: string): string {
  return CryptoJS.SHA256(value).toString();
}

/**
 * 🔐 Não determinístico → usar para VALORES
 */
export function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, SECRET).toString();
}

export function decrypt(value: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(value, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}
