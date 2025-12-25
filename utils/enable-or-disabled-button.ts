export function isCheckOptions (state: any, stateReducer: any) {
    if (!state?.questions?.length) return false;

    return state.questions.every((question: any) => {
        const selected = stateReducer.selectedAnswers[question.id] || [];
        const required = question.accept_two_alternatives ? 2 : 1;

        return selected.length === required;
    });
}

export function checkStateButton (state: any, stateReducer: any, isPending: any){
    return (state && state.error || (state && state.disabledButton)) || isPending || stateReducer.disabledCoolDown
}