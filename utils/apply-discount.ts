import { SUBTRAI_OU_ADICIONA_PONTOS_NAS_VARIAVEIS_DE_CONTROLE_DOS_TOPICOS } from '../constants';

export function applyTopicScoreDiscount(
  correct: boolean,
  valueTopic: number
): { discount: number; plus: boolean; minus: boolean } {
  if (correct) {
    if (valueTopic >= 100) {
      return {
        discount: 0,
        plus: true,
        minus: true,
      };
    }

    return {
      discount: Number(SUBTRAI_OU_ADICIONA_PONTOS_NAS_VARIAVEIS_DE_CONTROLE_DOS_TOPICOS),
      plus: true,
      minus: false,
    };
  }

  return {
    discount: Number(SUBTRAI_OU_ADICIONA_PONTOS_NAS_VARIAVEIS_DE_CONTROLE_DOS_TOPICOS),
    plus: false,
    minus: true,
  };
}
