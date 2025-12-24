/* ===============================
   FUNÇÃO AUXILIAR
=============================== */

import { generatorNumber } from "../utils/generator-number";
import { getIdsInLocalStoraged } from "../utils/get-ids-question-local-storaged";
import { saveIdQuestionCache } from "../utils/save-id-question-local-storaged";
import { getQuestionService } from "./get-question-service";

export async function generateNewQuestion() {

  let radomNumber: number | null = null;
  const arrayIds = getIdsInLocalStoraged();

  try {
    radomNumber = generatorNumber(1, 1, arrayIds);
  } catch {
    return {
      questions: [],
      message:
        "Você já respondeu todas as perguntas disponíveis no momento.",
      error: false,
      buttonText: "Voltar para o início"
    };
  }

  if (!radomNumber) {
    return {
      questions: [],
      message:
        "Ocorreu um problema no fluxo, por favor contate o desenvolvedor.",
      error: true
    };
  }

  saveIdQuestionCache(radomNumber);

  const { questions, success, message } =
    await getQuestionService(radomNumber);

  if (!success) {
    return {
      questions: [],
      message,
      error: true
    };
  }

  return {
    questions,
    currentQuestionId: radomNumber,
    validated: false,
    error: false
  };
}
