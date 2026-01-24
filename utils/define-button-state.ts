export function defineButtonState(state: any, isPending: boolean): string {
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
  return '';
}
