import { decrypt, encrypt, hashKey } from "./crypto";

export function saveIdQuestionCache(id: number) {
  const storageKey = hashKey(process.env.NEXT_PUBLIC_STORAGE_KEY!);
  const stored = localStorage.getItem(storageKey);

  let ids: number[] = [];

  if (stored) {
    const decryptedValue = decrypt(stored);
    try {
      const parsed = JSON.parse(decryptedValue);
      if (Array.isArray(parsed)) {
        ids = parsed;
      }
    } catch {}
  }

  if (!ids.includes(id)) {
    ids.push(id);
  }

  const encryptedValue = encrypt(JSON.stringify(ids));
  localStorage.setItem(storageKey, encryptedValue);
}
