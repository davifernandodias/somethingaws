import {
  BUTTON_TEXT_RELOAD,
  ERROR_MSG_GENERIC,
  ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
} from '../constants';
import { AppError } from '../errors/app-error';
import { generateRandomNumber } from '../utils/generator-number';
//import { getIdsInLocalStoraged, getVariablesGroupTopics } from '../utils/get-local-storaged';
//import { saveIdQuestionCache } from '../utils/save-local-storaged';
import { getQuestionService } from './question-fetcher.service';

export async function generateNewQuestion(
  categoryName?: string,
  shouldChangeTopicCategory?: boolean
) {
  let selectedQuestionId: number | null = null;
  let areAllTopicsCompleted = false;
  let fallbackCategory: string | undefined = undefined;
  //const excludedQuestionIds = getIdsInLocalStoraged();

  if (!shouldChangeTopicCategory) {
    try {
      selectedQuestionId = generateRandomNumber(1, 5, [1]); //excludedQuestionIds
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

    //saveIdQuestionCache(selectedQuestionId);
  }

  //const topicsProgressMap = getVariablesGroupTopics();

  //if (!topicsProgressMap) return;

  // Check if all topics have reached 100% completion
  // areAllTopicsCompleted = Object.values(topicsProgressMap).every((progress) => progress === 100);

  // // Find the category with the lowest completion percentage
  // const [categoryWithLowestProgress, lowestProgressPercentage] = Object.entries(
  //   topicsProgressMap
  // ).reduce((accumulated, currentTopic) => {
  //   return currentTopic[1] < accumulated[1] ? currentTopic : accumulated;
  // });

  // // Select a fallback category different from the current one if needed
  // if (shouldChangeTopicCategory && categoryName) {
  //   fallbackCategory = Object.keys(topicsProgressMap).find((topicKey) => topicKey !== categoryName);
  // }

  // const { questions, success, message } = await getQuestionService(
  //   shouldChangeTopicCategory ? null : selectedQuestionId,
  //   null,
  //   shouldChangeTopicCategory && !areAllTopicsCompleted ? fallbackCategory : null,
  //   getIdsInLocalStoraged()
  // );

  // // Cache the question ID if a topic change occurred
  // if (shouldChangeTopicCategory && selectedQuestionId !== questions[0]?.id) {
  //   saveIdQuestionCache(questions[0].id);
  // }

  // if (!success) {
  //   return {
  //     questions: [],
  //     message: message,
  //     error: true,
  //   };
  // }

  // return {
  //   questions,
  //   currentQuestionId: selectedQuestionId,
  //   validated: false,
  //   error: false,
  // };
}
