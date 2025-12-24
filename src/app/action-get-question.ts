
import { generateNewQuestion } from "../../service/generetor-question-aux";
import { MSG_QUESTAO_INCORRETA, MSG_QUESTAO_RESPONDIDA_COM_SUCESSO } from "../../utils/constants";
import { getIdsInLocalStoraged } from "../../utils/get-ids-question-local-storaged";


export async function sendQuestion(prevState: any, formData: FormData) {

  if (prevState === null) {
    return await generateNewQuestion();
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
        if(getIdsInLocalStoraged().length <= 0){
            return await generateNewQuestion();
        }
        // Senão, mantém o estado anterior
        return prevState;
    }

    const question = prevState.questions[0];
    const userAnswers = answers[question.id] ?? [];

    const correctIndexes = question.response.map((r: any, i: number) => r.rep ? i : null).filter((v: number | null) => v !== null);

    const isCorrect = correctIndexes.length === userAnswers.length && correctIndexes.every((i : any) => userAnswers.includes(i));

    return {
      ...prevState,
      validated: true,
      isCorrect,
      userAnswers,
      correctIndexes,
      message: isCorrect ? MSG_QUESTAO_RESPONDIDA_COM_SUCESSO : MSG_QUESTAO_INCORRETA,
    };
  }


  return await generateNewQuestion();
}