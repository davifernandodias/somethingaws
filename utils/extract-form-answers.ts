/**
 * Extracts user's selected answers from form data
 */
export function extractUserAnswersFromForm(formData: FormData): Record<number, number[]> {
  const answers: Record<number, number[]> = {};

  for (const [key, value] of formData.entries()) {
    // Procura por keys no formato "question_123"
    if (key.startsWith('question_')) {
      const questionId = parseInt(key.replace('question_', ''));
      const answerIndex = parseInt(value as string);

      if (!answers[questionId]) {
        answers[questionId] = [];
      }

      answers[questionId].push(answerIndex);
    }
  }

  return answers;
}
