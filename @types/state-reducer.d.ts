type SelectedAnswersMap = Record<string, number[]>;

type StateReducer = {
  amountLimitQuestions: number;
  openModalConfiguration: boolean;
  selectedAnswers: SelectedAnswersMap;
  disabledCoolDown: boolean;
};

type ReducerAction =
  | { type: 'open_modal_config_quiz'; payload: boolean }
  | {
      type: 'controls_quantity_selection_alternatives';
      payload: { questionId: number; index: number; acceptTwo: boolean };
    }
  | { type: 'controls_limite_questions'; payload: string }
  | { type: 'controls_disabled_button' }
  | { type: 'controls_enable_button' };
