export function isCheckOptions(state: QuestionState, stateReducer: StateReducer) {
  debugger;
  if (!state?.questions?.length) return false;

  return state.questions.every((question: Question) => {
    const selected = stateReducer.selectedAnswers[question.id] || [];
    const required = question.accept_two_alternatives ? 2 : 1;

    return selected.length === required;
  });
}

export function checkStateButton(
  state: QuestionState,
  stateReducer: StateReducer,
  isPending: boolean
) {
  return (
    (state && state.error) ||
    (state && state.disabledButton) ||
    isPending ||
    stateReducer.disabledCoolDown
  );
}
