export const createInitialState = (): QuestionState => ({
  questions: [],
  validated: false,
  isCorrect: null,
  userAnswers: [],
  correctIndexes: [],
  currentQuestionCount: 0,
  consecutiveErrorCount: 0,
  disabledButton: false,
  message: '',
  error: false,
  modalAlert: false,
  buttonText: null,
  userScoreReceivedPoints: {
    fundamental_cloud_concepts: 0,
    security_compliance: 0,
    cloud_technology: 0,
    billing_pricing: 0,
  },
});

/**
 * Helper to create consistent state responses
 * Merges partial state with previous state or initial state
 */
export const createStateResponse = (
  partial: Partial<QuestionState>,
  previousState: QuestionState | null = null
): QuestionState => {
  const base = previousState || createInitialState();
  return {
    ...base,
    ...partial,
  };
};
