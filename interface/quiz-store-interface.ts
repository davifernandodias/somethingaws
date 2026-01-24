export interface QuizState extends Record<Topic, number> {
  increasePoints: (topic: Topic, points: number) => void;
  decreasePoints: (topic: Topic, points: number) => void;
  resetTopic: (topic: Topic) => void;
  resetAll: () => void;
  getTotalScore: () => number;
  getTopicPercentage: (topic: Topic) => number;
}
