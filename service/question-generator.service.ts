import {
  BUTTON_TEXT_RELOAD,
  ERROR_MSG_GENERIC,
  ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
} from '../constants';
import { AppError } from '../errors/app-error';
import { generateRandomNumber } from '../utils/generator-number';
import { reverseRenameTopicGroup } from '../utils/rename-topic-name';
import { getQuestionService } from './question-fetcher.service';

export async function generateNewQuestion({
  categoryName,
  shouldChangeTopicCategory,
  excludedQuestionIds = [],
  userScore = {},
}: {
  categoryName?: Topic;
  shouldChangeTopicCategory?: boolean;
  excludedQuestionIds?: number[];
  userScore?: { [key: string]: number };
} = {}) {
  let selectedQuestionId: number | null = null;

  if (shouldChangeTopicCategory === undefined) {
    try {
      selectedQuestionId = generateRandomNumber(1, 5, excludedQuestionIds);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return {
          questions: [],
          message: error.message,
          error: true,
          buttonText: BUTTON_TEXT_RELOAD,
          modalAlert: true,
        };
      }

      // Fallback for unexpected errors
      return {
        questions: [],
        message: ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
        error: true,
        buttonText: BUTTON_TEXT_RELOAD,
        modalAlert: true,
      };
    }

    if (!selectedQuestionId) {
      return {
        questions: [],
        message: ERROR_MSG_GENERIC,
        error: true,
      };
    }
  }

  //If changing topic, search new category
  if (shouldChangeTopicCategory) {
    const { questions, success, message } = await getQuestionService({
      category: reverseRenameTopicGroup(categoryName),
      arrayIds: excludedQuestionIds,
    });

    if (!questions || !success) {
      return {
        questions: [],
        message,
        error: true,
      };
    }
    return {
      questions,
      validated: false,
      error: false,
    };
  }

  const lowestTopic = Object.entries(userScore).reduce((min, current) => {
    const [, minValue] = min;
    const [, currentValue] = current;

    return currentValue < minValue ? current : min;
  })[0];

  const { questions, success, message } = await getQuestionService({
    //id: selectedQuestionId,
    category: reverseRenameTopicGroup(lowestTopic),
    arrayIds: excludedQuestionIds,
  });

  if (!questions || !success) {
    return {
      questions: [],
      message: ERROR_MSG_GENERIC,
      error: true,
    };
  }

  return {
    questions,
    validated: false,
    error: false,
  };
}
