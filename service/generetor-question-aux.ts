import { BUTTON_TEXT_RELOAD, MSG_ERRO_GENERICO, MSG_EXCEDEU_LIMITE_DE_PERGUNTAS_RESPONDIDAS } from "../constants";
import { generatorNumber } from "../utils/generator-number";
import { getIdsInLocalStoraged } from "../utils/get-local-storaged";
import { saveIdQuestionCache } from "../utils/save-local-storaged";
import { getQuestionService } from "./get-question-service";

export async function generateNewQuestion() {

  let radomNumber: number | null = null;
  const arrayIds = getIdsInLocalStoraged();

  try {
    // TROCAR PARA O RANGE DE 200 QUESTÕES
    radomNumber = generatorNumber(1, 1, arrayIds);
  } catch (error: any) {
    return {
      questions: [],
      message: (error.message ? error.message : MSG_EXCEDEU_LIMITE_DE_PERGUNTAS_RESPONDIDAS),
      error: false,
      buttonText: BUTTON_TEXT_RELOAD,
      modalAlert: true
    };
  }

  if (!radomNumber) {
    return {
      questions: [],
      message: MSG_ERRO_GENERICO,
      error: true
    };
  }

  saveIdQuestionCache(radomNumber);

  const { questions, success, message } = await getQuestionService(radomNumber);

  if (!success) {
    return {
      questions: [],
      message: message,
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
