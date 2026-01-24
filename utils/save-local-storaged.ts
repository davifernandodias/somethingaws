import { applyTopicScoreDiscount } from './apply-discount';
import { decrypt, encrypt, hashKey } from './crypto';
import { getVariablesGroupTopics } from './get-local-storaged';

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

    if (isNaN(storedValue)) {
      throw new Error('Valor armazenado inválido');
    }

    if (storedValue === limit || limit === undefined) {
      return null;
    }
  }

  const encryptedValue = encrypt(String(limit ?? 10));
  localStorage.setItem(storageKey, encryptedValue);
}

export function saveVariablesInitialGroupTopics(
  topics_group?: TopicGroup,
  correct: boolean = false
) {
  const storageKey = hashKey(process.env.NEXT_PUBLIC_STORAGE_KEY_VARIABLES!);

  let variables = getVariablesGroupTopics() as TopicVariables | null;

  if (!variables) {
    variables = {
      fundamental_cloud_concepts: 100,
      security_compliance: 100,
      cloud_technology: 100,
      billing_pricing: 100,
    };
  }

  if (topics_group && topics_group in variables) {
    const currentValue = variables[topics_group];

    const { discount, plus, minus } = applyTopicScoreDiscount(correct, currentValue);

    if (plus) {
      variables[topics_group] = Math.max(0, currentValue + discount);
    } else if (minus) {
      variables[topics_group] = Math.max(0, currentValue - discount);
    }
  } else if (topics_group) {
    console.warn('Tópico inválido recebido:', topics_group);
  }

  localStorage.removeItem(storageKey);

  const encryptedValue = encrypt(JSON.stringify(variables));
  localStorage.setItem(storageKey, encryptedValue);
}
