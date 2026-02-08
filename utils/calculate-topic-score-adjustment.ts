import { POINTS_ADJUSTMENT_RATE } from '../constants';

export function calculateTopicScoreAdjustment(
  isCorrect: boolean,
  currentTopicScore: number
): { adjustment: number; shouldIncrease: boolean; shouldDecrease: boolean } {
  if (isCorrect) {
    const isAtMaximumScore = currentTopicScore >= 300;

    if (isAtMaximumScore) {
      return {
        adjustment: 0,
        shouldIncrease: false,
        shouldDecrease: false,
      };
    }

    return {
      adjustment: Number(POINTS_ADJUSTMENT_RATE),
      shouldIncrease: true,
      shouldDecrease: false,
    };
  }

  return {
    adjustment: Number(POINTS_ADJUSTMENT_RATE),
    shouldIncrease: false,
    shouldDecrease: true,
  };
}
