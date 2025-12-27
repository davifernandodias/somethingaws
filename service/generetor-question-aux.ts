import { BUTTON_TEXT_RELOAD, MSG_ERRO_GENERICO, MSG_EXCEDEU_LIMITE_DE_PERGUNTAS_RESPONDIDAS } from "../constants";
import { generatorNumber } from "../utils/generator-number";
import { getIdsInLocalStoraged, getVariablesGroupTopics } from "../utils/get-local-storaged";
import { saveIdQuestionCache } from "../utils/save-local-storaged";
import { getQuestionService } from "./get-question-service";

export async function generateNewQuestion() {

  let radomNumber: number | null = null;
  let allTopics = null;
  const arrayIds = getIdsInLocalStoraged();

  try {
    // TROCAR PARA O RANGE DE 200 QUESTÕES
    radomNumber = generatorNumber(1, 2, arrayIds);
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

  let variablesGroupTopic = getVariablesGroupTopics();

  if(!variablesGroupTopic) return;

  // Pecorre todos os topicos e verifica se todos estão 100%
  allTopics = Object.values(variablesGroupTopic).every((value) => value === 100);

  // Pecorre todos os topicos e recupera o menor
  let [category, level] = Object.entries(variablesGroupTopic).reduce((min, current) => { return current[1] < min[1] ? current : min })

  const { questions, success, message } = await getQuestionService(radomNumber, (allTopics ? null : null), (allTopics ? null : category));


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
