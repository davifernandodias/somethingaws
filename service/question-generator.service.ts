import {
  BUTTON_TEXT_RELOAD,
  ERROR_MSG_GENERIC,
  ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
} from '../constants';
import { AppError } from '../errors/app-error';
import { generateRandomNumber } from '../utils/generator-number';
import { reverseRenameTopicGroup } from '../utils/rename-topic-name';
import { ALL_TOPICS } from '../utils/draws-question-topic';
import { getQuestionService } from './question-fetcher.service';

export async function generateNewQuestion({
  categoryName,
  shouldChangeTopicCategory,
  excludedQuestionIds = [],
  userScore = {},
}: {
  categoryName?: Topic | string;
  shouldChangeTopicCategory?: boolean;
  excludedQuestionIds?: number[];
  userScore?: { [key: string]: number };
} = {}) {
  let selectedQuestionId: number | null = null;

  if (shouldChangeTopicCategory === undefined) {
    try {
      selectedQuestionId = generateRandomNumber(1, 200, excludedQuestionIds);
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
        modalAlert: false,
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

  if (shouldChangeTopicCategory) {
    if (categoryName == null || categoryName === '') {
      return {
        questions: [],
        message: ERROR_MSG_GENERIC,
        error: true,
      };
    }
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

  const entries = Object.entries(userScore);
  let topicToFetch: string;

  if (entries.length === 0) {
    topicToFetch = ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
  } else {
    const [topicWithLowestScore] = entries.reduce<[string, number]>(
      (min, current) => {
        const [, minScore] = min;
        const [, currentScore] = current;
        return currentScore < minScore ? (current as [string, number]) : min;
      },
      entries[0] as [string, number]
    );
    topicToFetch = topicWithLowestScore;
  }

  const categoryToFetch = reverseRenameTopicGroup(topicToFetch);

  const { questions, success, message } = await getQuestionService({
    category: categoryToFetch,
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
