export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'open_modal_config_quiz': {
      return { ...state, openModalConfiguration: action.payload };
    }
    case 'controls_quantity_selection_alternatives': {
      const { questionId, index, acceptTwo } = action.payload;

      const current = state.selectedAnswers[questionId] || [];
      const max = acceptTwo ? 2 : 1;

      if (current.includes(index)) {
        return {
          ...state,
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionId]: current.filter((i: number) => i !== index),
          },
        };
      }
      if (current.length >= max) {
        return state;
      }

      return {
        ...state,
        selectedAnswers: { ...state.selectedAnswers, [questionId]: [...current, index] },
      };
    }
    case 'controls_limite_questions': {
      let value = Number(action.payload);

      if (isNaN(value)) return state;

      value = Math.min(20, Math.max(1, value));

      return { ...state, amount_limit_questions: value };
    }
    case 'controls_disabled_button': {
      return { ...state, disabledCoolDown: true };
    }
    case 'controls_enable_button': {
      return { ...state, disabledCoolDown: false };
    }
    default:
      return state;
  }
};
