export interface QuizState {
  fundamental_cloud_concepts: number;
  security_compliance: number;
  cloud_technology: number;
  billing_pricing: number;
  increasePoints: (topic: TopicGroup, points: number) => void;
  decreasePoints: (topic: TopicGroup, points: number) => void;
  resetTopic: (topic: TopicGroup) => void;
  resetAll: () => void;
  getTotalScore: () => number;
  getTopicPercentage: (topic: TopicGroup) => number;
}
