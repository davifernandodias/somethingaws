import { ERROR_MSG_NO_NUMBERS_IN_RANGE } from '../constants';
import { AppError } from '../errors/app-error';

export function generateRandomNumber(min: number, max: number, excludedIds: number[] = []): number {
  const availableNumbers: number[] = [];

  // Build a list of numbers that are still available
  for (let i = min; i <= max; i++) {
    if (!excludedIds.includes(i)) {
      availableNumbers.push(i);
    }
  }

  // If there are no available numbers, this is an expected (operational) error
  if (availableNumbers.length === 0) {
    throw new AppError(ERROR_MSG_NO_NUMBERS_IN_RANGE, {
      code: 'NO_NUMBERS_AVAILABLE',
    });
  }

  // Pick a random number from the available options
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  return availableNumbers[randomIndex];
}
