/**
 *
 * This function was created to assist in standardizing code in the flows for changing the input value and controlling the disabled button.
 */
export function isCheckOptions(state: QuestionState, stateReducer: StateReducer) {
  if (!state.questions.length) return false;

  return state.questions.every((question: Question) => {
    const selected = stateReducer.selectedAnswers[question.id] || [];
    const required = question.accept_two_alternatives ? 2 : 1;

    return selected.length === required;
  });
}
