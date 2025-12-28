
import { generateNewQuestion } from "../../service/generetor-question-aux";
import { MSG_LIMITE_QUESTOES_RESPONDIDAS, MSG_QUESTAO_INCORRETA, MSG_QUESTAO_RESPONDIDA_COM_SUCESSO } from "../../constants";
import { getLimitQuestionInLocalStoraged, getVariablesGroupTopics } from "../../utils/get-local-storaged";
import { saveVariablesInitialGroupTopics } from "../../utils/save-local-storaged";
import { renameTopicGroup } from "../../utils/rename-topic-name";


export async function sendQuestion(prevState: any, formData: FormData) {

  let limitQuestion = (prevState?.limitQuestionRep + 1) || 1;
  let limitiQuestionLocalStoraged = getLimitQuestionInLocalStoraged() ?? 10;
  let variablesGroupTopic = null;

  if (prevState === null && !variablesGroupTopic) {
    saveVariablesInitialGroupTopics();


    let response = await generateNewQuestion();


    return {...response, limitQuestionRep: limitQuestion, variablesGroupTopic};
  }

  variablesGroupTopic = getVariablesGroupTopics();

  if (!prevState.validated) {

    const answers: Record<number, number[]> = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/answers\[(\d+)\]/);
      if (!match) continue;

      const questionId = Number(match[1]);

      if (!answers[questionId]) {
        answers[questionId] = [];
      }

      answers[questionId].push(Number(value));
    }

    const question = prevState.questions[0];

    const userAnswers = answers[question.id] ?? [];

    const correctIndexes = question.response.map((r: any, i: number) => r.rep ? i : null).filter((v: number | null) => v !== null);

    const isCorrect = correctIndexes.length === userAnswers.length && correctIndexes.every((i: any) => userAnswers.includes(i));

    const topicKey : TopicGroup = renameTopicGroup(question.group_by_topic);

    if (topicKey && variablesGroupTopic) { saveVariablesInitialGroupTopics(topicKey, isCorrect); }

    return {
      ...prevState,
      validated: true,
      isCorrect,
      userAnswers,
      correctIndexes,
      message: isCorrect ? MSG_QUESTAO_RESPONDIDA_COM_SUCESSO : MSG_QUESTAO_INCORRETA,
      disabledButton: false,
      limitQuestionRep: limitQuestion
    };
  }

  if(limitQuestion > limitiQuestionLocalStoraged + 1){
    return {
      ...prevState,
      disabledButton: true,
      message: MSG_LIMITE_QUESTOES_RESPONDIDAS,
      limitQuestionRep: limitQuestion
    }
  }

  return {
    ...await generateNewQuestion(),
    limitQuestionRep: limitQuestion
  };
}