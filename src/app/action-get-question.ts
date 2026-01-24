import { generateNewQuestion } from '../../service/question-generator.service';
import {
  ERROR_MSG_QUESTION_GENERATION_FAILED,
  ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
  SUCCESS_MSG_INCORRECT_ANSWER,
  SUCCESS_MSG_CORRECT_ANSWER,
} from '../../constants';

import { renameTopicGroup } from '../../utils/rename-topic-name';
import { extractUserAnswersFromForm } from '../../utils/extract-form-answers';
import { createStateResponse } from '../../utils/question-state.utils';

export async function sendQuestion(
  previousState: QuestionState | null,
  formData: FormData
): Promise<QuestionState> {
  const requestedQuestionLimit = Number(formData.get('amount_limit_questions'));
  const currentQuestionCount = (previousState?.currentQuestionCount || 0) + 1;
  const consecutiveErrorCount = previousState?.consecutiveErrorCount || 0;

  // Initial load - generate first question
  if (previousState === null) {
    const generatedQuestion = await generateNewQuestion();

    return createStateResponse({
      ...generatedQuestion,
      currentQuestionCount,
      validated: false,
      isCorrect: null,
      userAnswers: [],
      correctIndexes: [],
      disabledButton: false,
      message: '',
      error: false,
      modalAlert: false,
      buttonText: null,
    });
  }

  // Validate user's answer if not yet validated
  if (!previousState.validated) {
    const userAnswersMap = extractUserAnswersFromForm(formData);
    const currentQuestion = previousState.questions[0];
    const userSelectedIndexes = userAnswersMap[currentQuestion.id] || [];

    const correctAnswerIndexes = currentQuestion.response
      .map((response: QuestionResponse, index: number) => (response.rep ? index : null))
      .filter((value: number | null) => value !== null);

    const isAnswerCorrect =
      correctAnswerIndexes.length === userSelectedIndexes.length &&
      correctAnswerIndexes.every((index: number) => userSelectedIndexes.includes(index));

    const topicKey: Topic | undefined = renameTopicGroup(currentQuestion.group_by_topic);

    if (!topicKey) {
      return createStateResponse(
        {
          questions: [],
          message: ERROR_MSG_QUESTION_GENERATION_FAILED,
          error: true,
          disabledButton: true,
        },
        previousState
      );
    }

    const updatedErrorCount = isAnswerCorrect
      ? Math.max(0, consecutiveErrorCount - 1)
      : consecutiveErrorCount + 1;

    return createStateResponse(
      {
        validated: true,
        isCorrect: isAnswerCorrect,
        userAnswers: userSelectedIndexes,
        correctIndexes: correctAnswerIndexes,
        message: isAnswerCorrect ? SUCCESS_MSG_CORRECT_ANSWER : SUCCESS_MSG_INCORRECT_ANSWER,
        disabledButton: false,
        currentQuestionCount,
        consecutiveErrorCount: updatedErrorCount,
        error: false,
      },
      previousState
    );
  }

  // Check if user exceeded question limit
  if (false) {
    return createStateResponse(
      {
        disabledButton: true,
        message: ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
        currentQuestionCount,
        consecutiveErrorCount,
        error: true,
      },
      previousState
    );
  }

  // Switch topic if user made 2+ consecutive errors
  if (consecutiveErrorCount >= 2) {
    const questionWithNewTopic = await generateNewQuestion(
      previousState.questions[0].group_by_topic,
      true
    );

    return createStateResponse({
      ...questionWithNewTopic,
      currentQuestionCount,
      consecutiveErrorCount: 0,
      validated: false,
      isCorrect: null,
      userAnswers: [],
      correctIndexes: [],
      disabledButton: false,
      message: '',
      error: false,
    });
  }

  // Generate next question in same topic
  const nextQuestion = await generateNewQuestion();

  return createStateResponse({
    ...nextQuestion,
    currentQuestionCount,
    consecutiveErrorCount,
    validated: false,
    isCorrect: null,
    userAnswers: [],
    correctIndexes: [],
    disabledButton: false,
    message: '',
    error: false,
  });
}
