import { decrypt, hashKey } from "./crypto";

export function getIdsInLocalStoraged(): number[] {
  const storageKey = hashKey(process.env.NEXT_PUBLIC_STORAGE_KEY!);
  const stored = localStorage.getItem(storageKey);

  if (!stored) return [];

  const decryptedValue = decrypt(stored);

  try {
    const ids = JSON.parse(decryptedValue);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}


export function getLimitQuestionInLocalStoraged(): number | null {
  const storageKey = hashKey(process.env.NEXT_PUBLIC_LIMITE_QUANTIDADE_QUESTOES_CHAVE_NOME!);
  const stored = localStorage.getItem(storageKey);

  if (!stored) return null;

  const decryptedValue = decrypt(stored);
  const limit = Number(decryptedValue);

  return isNaN(limit) ? null : limit;
}