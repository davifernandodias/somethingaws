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

export function saveLimitQuestionInLocalStoraged(limit?: number) {
  const storageKey = hashKey(process.env.NEXT_PUBLIC_LIMITE_QUANTIDADE_QUESTOES_CHAVE_NOME!);

  const encryptedStored = localStorage.getItem(storageKey);

  if (encryptedStored) {
    const storedValue = Number(decrypt(encryptedStored));

    if(isNaN(storedValue)){
      throw new Error('Valor armazenado inválido');
    }

    console.log('valor recuperado: ' + storedValue, 'valor recebido pelo component: ' + limit);
    if (storedValue === limit || limit === undefined) {
      return null;
    }
  }

  const encryptedValue = encrypt(String(limit ?? 10));
  localStorage.setItem(storageKey, encryptedValue);
}
