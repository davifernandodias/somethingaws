/**
 * Extracts user's selected answers from form data
 * @param formData - Form data containing user answers
 * @returns Map of question IDs to selected answer indexes
 */
export function extractUserAnswersFromForm(formData: FormData): Record<number, number[]> {
  const answersMap: Record<number, number[]> = {};

  for (const [key, value] of formData.entries()) {
    const questionIdMatch = key.match(/answers\[(\d+)\]/);

    if (!questionIdMatch) continue;

    const questionId = Number(questionIdMatch[1]);

    if (!answersMap[questionId]) {
      answersMap[questionId] = [];
    }

    answersMap[questionId].push(Number(value));
  }

  return answersMap;
}
