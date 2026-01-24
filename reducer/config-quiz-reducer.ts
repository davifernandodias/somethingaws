export const reducer = (state: StateReducer, action: ReducerAction) => {
  debugger;
  switch (action.type) {
    case 'open_modal_config_quiz': {
      return { ...state, openModalConfiguration: action.payload };
    }

    case 'controls_quantity_selection_alternatives': {
      const { questionId, index, acceptTwo } = action.payload;
      const currentAnswers = state.selectedAnswers[questionId] || [];
      const maxSelections = acceptTwo ? 2 : 1;

      // Remove answer if already selected
      if (currentAnswers.includes(index)) {
        return {
          ...state,
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionId]: currentAnswers.filter((i: number) => i !== index),
          },
        };
      }

      // Prevent selecting more than allowed
      if (currentAnswers.length >= maxSelections) {
        return state;
      }

      // Add new answer selection
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: [...currentAnswers, index],
        },
      };
    }

    case 'controls_limite_questions': {
      let value = Number(action.payload);

      if (isNaN(value)) return state;

      // Clamp value between 1 and 20
      value = Math.min(20, Math.max(1, value));

      return { ...state, amountLimitQuestions: value };
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
