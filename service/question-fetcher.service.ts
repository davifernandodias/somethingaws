import json_questions from '../data/json_question.json' assert { type: 'json' };

export async function getQuestionService({
  id = null,
  level = null,
  category = null,
  arrayIds = [],
}: {
  id?: number | null;
  level?: number | null;
  category?: string | null;
  arrayIds?: number[];
}): Promise<{
  questions: Question[];
  success: boolean;
  message: string;
}> {
  debugger;
  let questions: Question[] = [];

  if (category) {
    const question = json_questions.find((q) => {
      return q.group_by_topic === category && !arrayIds.includes(q.id);
    });

    if (!question) {
      return {
        questions: [],
        success: false,
        message: 'Nenhuma questão nova encontrada para esse tópico.',
      };
    }

    questions = [question];
  } else {
    let question = json_questions.find((q) => q.id === id);

    if (!question) {
      return {
        questions: [],
        success: false,
        message: 'Nenhuma questão encontrada para o ID informado.',
      };
    }

    questions = [question];
  }

  return { questions, success: true, message: 'Questão encontrada com sucesso.' };
}
