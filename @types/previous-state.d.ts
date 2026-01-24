type QuestionState = {
  questions: Question[];
  validated: boolean;
  isCorrect: boolean | null;
  userAnswers: number[];
  correctIndexes: number[];
  currentQuestionCount: number;
  consecutiveErrorCount: number;
  disabledButton: boolean;
  message: string;
  error: boolean;
  modalAlert: boolean;
  buttonText: string | null;
};
