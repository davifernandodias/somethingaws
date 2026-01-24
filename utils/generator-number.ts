import { MSG_ERRO_AO_GERAR_PERGUNTA_INTERVALO_INCORRETO } from '../constants';

export function generatorNumber(min: number, max: number, arrayIds: number[] = []): number {
  const totalPossibilities = max - min + 1;

  const blocked = arrayIds.filter(id => id >= min && id <= max).length;

  if (blocked >= totalPossibilities) {
    throw new Error(MSG_ERRO_AO_GERAR_PERGUNTA_INTERVALO_INCORRETO);
  }

  let random: number;

  do {
    random = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (arrayIds.includes(random));

  return random;
}
