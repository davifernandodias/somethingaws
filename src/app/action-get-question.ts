import { generateNewQuestion } from '../../service/question-generator.service';
import {
  ERROR_MSG_QUESTION_GENERATION_FAILED,
  ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
  SUCCESS_MSG_INCORRECT_ANSWER,
  SUCCESS_MSG_CORRECT_ANSWER,
} from '../../constants';

import { renameTopicGroup } from '../../utils/rename-topic-name';
import { extractUserAnswersFromForm } from '../../utils/extract-form-answers';

export async function sendQuestion(previousState: any, formData: FormData) {
  const requestedQuestionLimit = Number(formData.get('amount_limit_questions')) || 10;
  const currentQuestionCount = (previousState?.currentQuestionCount || 0) + 1;
  //const storedQuestionLimit = getLimitQuestionInLocalStoraged() || 10;
  const consecutiveErrorCount = previousState?.consecutiveErrorCount || 0;

  // Initial load - generate first question
  if (previousState === null) {
    const generatedQuestion = await generateNewQuestion();
    //const topicsProgressMap = getVariablesGroupTopics();

    return {
      ...generatedQuestion,
      currentQuestionCount,
      //topicsProgressMap,
    };
  }

  //const topicsProgressMap = getVariablesGroupTopics();

  // Validate user's answer if not yet validated
  if (!previousState.validated) {
    const userAnswersMap = extractUserAnswersFromForm(formData);
    const currentQuestion = previousState.questions[0];
    const userSelectedIndexes = userAnswersMap[currentQuestion.id] || [];

    // Extract correct answer indexes from question
    const correctAnswerIndexes = currentQuestion.response
      .map((response: any, index: number) => (response.rep ? index : null))
      .filter((value: number | null) => value !== null);

    // Check if user's answer is correct
    const isAnswerCorrect =
      correctAnswerIndexes.length === userSelectedIndexes.length &&
      correctAnswerIndexes.every((index: number) => userSelectedIndexes.includes(index));

    // Map question topic to internal topic key
    const topicKey: Topic | undefined = renameTopicGroup(currentQuestion.group_by_topic);

    if (!topicKey) {
      return {
        questions: [],
        message: ERROR_MSG_QUESTION_GENERATION_FAILED,
        error: true,
      };
    }

    // Update topic progress based on answer correctness
    if (topicKey) {
      //topicsProgressMap
      //saveVariablesInitialGroupTopics(topicKey, isAnswerCorrect);
    }

    // Track consecutive errors for topic switching logic
    const updatedErrorCount = isAnswerCorrect
      ? Math.max(0, consecutiveErrorCount - 1)
      : consecutiveErrorCount + 1;

    return {
      ...previousState,
      validated: true,
      isCorrect: isAnswerCorrect,
      userAnswers: userSelectedIndexes,
      correctIndexes: correctAnswerIndexes,
      message: isAnswerCorrect ? SUCCESS_MSG_CORRECT_ANSWER : SUCCESS_MSG_INCORRECT_ANSWER,
      disabledButton: false,
      currentQuestionCount,
      consecutiveErrorCount: updatedErrorCount,
    };
  }

  // Check if user exceeded question limit
  if (false) {
    return {
      ...previousState,
      disabledButton: true,
      message: ERROR_MSG_EXCEEDED_QUESTION_LIMIT,
      currentQuestionCount,
      consecutiveErrorCount,
    };
  }

  // Switch topic if user made 2+ consecutive errors
  if (consecutiveErrorCount >= 2) {
    const questionWithNewTopic = await generateNewQuestion(
      previousState.questions[0].group_by_topic,
      true
    );

    return {
      ...questionWithNewTopic,
      currentQuestionCount,
      consecutiveErrorCount: 0, // Reset error count on topic change
    };
  }

  // Generate next question in same topic
  const nextQuestion = await generateNewQuestion();

  return {
    ...nextQuestion,
    currentQuestionCount,
    consecutiveErrorCount,
  };
}
