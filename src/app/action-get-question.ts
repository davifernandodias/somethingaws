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
import { calculateTopicScoreAdjustment } from '../../utils/calculate-topic-score-adjustment';
import { switchTopicAfterTwoConsecutiveErrors } from '../../utils/draws-question-topic';

export async function sendQuestion(
  previousState: QuestionState | null,
  formData: FormData,
  topicsScore: TopicsScoreMap
): Promise<QuestionState> {
  const requestedQuestionLimit = Number(formData.get('amount_limit_questions'));

  const drawnQuestionIds = previousState?.drawnQuestionIds || [];
  const currentQuestionId = previousState?.questions[0]?.id;

  const userScore = previousState?.userScoreReceivedPoints ?? topicsScore;
  const consecutiveErrorCount = previousState?.consecutiveErrorCount || 0;
  let currentQuestionCount = previousState?.currentQuestionCount || 0;

  // Initial load - generate first question
  if (previousState === null) {
    const generatedQuestion = await generateNewQuestion({
      excludedQuestionIds: [],
      userScore,
    });

    // Added first question count
    currentQuestionCount += 1;

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
      userScoreReceivedPoints: userScore,
      drawnQuestionIds: generatedQuestion.questions[0]?.id
        ? [generatedQuestion.questions[0].id]
        : [],
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

    const updatedErrorCount = isAnswerCorrect
      ? Math.max(0, consecutiveErrorCount - 1)
      : consecutiveErrorCount + 1;

    const renamedTopic = renameTopicGroup(currentQuestion.group_by_topic);

    if (!renamedTopic) {
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

    const { adjustment, shouldIncrease, shouldDecrease } = calculateTopicScoreAdjustment(
      isAnswerCorrect,
      previousState.userScoreReceivedPoints[renamedTopic]
    );

    if (!shouldDecrease && !shouldIncrease && adjustment < 0) {
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

    if (shouldIncrease) {
      userScore[renamedTopic] = Math.min(userScore[renamedTopic] + adjustment, 100);
    }

    if (shouldDecrease) {
      userScore[renamedTopic] = Math.max(userScore[renamedTopic] - adjustment, 0);
    }

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
        userScoreReceivedPoints: userScore,
        drawnQuestionIds: previousState.drawnQuestionIds,
      },
      previousState
    );
  }

  const updatedDrawnIds =
    currentQuestionId && !drawnQuestionIds.includes(currentQuestionId)
      ? [...drawnQuestionIds, currentQuestionId]
      : drawnQuestionIds;

  currentQuestionCount += 1;

  // Check if user exceeded question limit
  if (currentQuestionCount >= requestedQuestionLimit) {
    return createStateResponse(
      {
        disabledButton: true,
        message: ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
        currentQuestionCount,
        consecutiveErrorCount,
        error: false,
        drawnQuestionIds: updatedDrawnIds,
      },
      previousState
    );
  }

  let renamedTopic = renameTopicGroup(previousState.questions[0].group_by_topic);

  if (!renamedTopic) {
    return createStateResponse(
      {
        questions: [],
        message: ERROR_MSG_QUESTION_GENERATION_FAILED,
        error: true,
        disabledButton: true,
        drawnQuestionIds: updatedDrawnIds,
      },
      previousState
    );
  }

  // Switch topic if user made 2+ consecutive errors
  if (consecutiveErrorCount >= 2) {
    const questionWithNewTopic = await generateNewQuestion({
      excludedQuestionIds: updatedDrawnIds,
      userScore,
      shouldChangeTopicCategory: true,
      categoryName: switchTopicAfterTwoConsecutiveErrors(renamedTopic),
    });

    const newQuestionId = questionWithNewTopic.questions[0]?.id;
    const finalDrawnIds =
      newQuestionId && !updatedDrawnIds.includes(newQuestionId)
        ? [...updatedDrawnIds, newQuestionId]
        : updatedDrawnIds;

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
      userScoreReceivedPoints: userScore,
      drawnQuestionIds: finalDrawnIds,
    });
  }

  // Generate next question in same topic
  const nextQuestion = await generateNewQuestion({
    excludedQuestionIds: updatedDrawnIds,
    userScore,
    categoryName: renamedTopic,
  });

  const newQuestionId = nextQuestion.questions[0]?.id;
  const finalDrawnIds =
    newQuestionId && !updatedDrawnIds.includes(newQuestionId)
      ? [...updatedDrawnIds, newQuestionId]
      : updatedDrawnIds;

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
    userScoreReceivedPoints: userScore,
    drawnQuestionIds: finalDrawnIds,
  });
}
