export function defineButtonState(
  state: QuestionState | null,
  isPending: boolean
): string | undefined {
  if (state) {
    if (state.disabledButton) {
      return 'Recomeçar';
    } else if (state.validated || state.isCorrect) {
      return 'Próxima pergunta';
    } else if (!state.validated) {
      return 'Responder pergunta';
    }
  } else {
    if (isPending) {
      return 'Carregando...';
    }

    return 'Começar quiz';
  }
}
