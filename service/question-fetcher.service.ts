import json_questions from '../data/json_questions.json' assert { type: 'json' };

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
  let questions: Question[] = [];

  if (category) {
    const availableQuestions = json_questions.filter((q) => {
      return q.group_by_topic === category && !arrayIds.includes(q.id);
    });

    if (availableQuestions.length === 0) {
      return {
        questions: [],
        success: false,
        message: 'Nenhuma questão nova encontrada para esse tópico.',
      };
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    questions = [selectedQuestion];

    return {
      questions,
      success: true,
      message: 'Questão encontrada com sucesso.',
    };
  }

  if (id !== null) {
    const question = json_questions.find((q) => q.id === id);

    if (!question) {
      return {
        questions: [],
        success: false,
        message: 'Nenhuma questão encontrada para o ID informado.',
      };
    }

    questions = [question];

    return {
      questions,
      success: true,
      message: 'Questão encontrada com sucesso.',
    };
  }

  console.log({ messagem: 'Nenhum critério de busca fornecido', id, level, category, arrayIds });
  return {
    questions: [],
    success: false,
    message: 'Nenhum critério de busca foi fornecido.',
  };
}
