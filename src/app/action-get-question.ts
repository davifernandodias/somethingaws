
import { generateNewQuestion } from "../../service/generetor-question-aux";
import { MSG_LIMITE_QUESTOES_RESPONDIDAS, MSG_QUESTAO_INCORRETA, MSG_QUESTAO_RESPONDIDA_COM_SUCESSO } from "../../constants";
import { getIdsInLocalStoraged, getLimitQuestionInLocalStoraged } from "../../utils/get-local-storaged";


export async function sendQuestion(prevState: any, formData: FormData) {


  let limitQuestion = (prevState?.limitQuestionRep + 1) || 1;
  let limitiQuestionLocalStoraged = getLimitQuestionInLocalStoraged() ?? 10;

  if (prevState === null) {
    let response = await generateNewQuestion();

    return {
      ...response,
      limitQuestionRep: limitQuestion
    };
  }


  if(limitQuestion > limitiQuestionLocalStoraged){
    return {
      ...prevState,
      disabledButton: true,
      message: MSG_LIMITE_QUESTOES_RESPONDIDAS,
      limitQuestionRep: limitQuestion
    }
  }

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

    // Se não marcou nada, não valida ainda
    if (Object.keys(answers).length === 0) {
      // Se não há mais perguntas disponíveis, reinicia o quiz
      if (getIdsInLocalStoraged().length <= 0) {
        return await generateNewQuestion();
      }
      // Senão, mantém o estado anterior
      return {
        ...prevState,
        disabledButton: false,
        limitQuestionRep: limitQuestion
      };
    }

    const question = prevState.questions[0];
    const userAnswers = answers[question.id] ?? [];

    const correctIndexes = question.response.map((r: any, i: number) => r.rep ? i : null).filter((v: number | null) => v !== null);

    const isCorrect = correctIndexes.length === userAnswers.length && correctIndexes.every((i: any) => userAnswers.includes(i));

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


  if (prevState.validated) {

  }


  return {
    ...await generateNewQuestion(),
    limitQuestionRep: limitQuestion
  };
}