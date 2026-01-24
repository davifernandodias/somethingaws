import { create } from 'zustand';
import { QuizState } from './interface/quiz-store-interface';

export const useControlPointsTopicsQuestions = create<QuizState>((set, get) => ({
  fundamental_cloud_concepts: 100,
  security_compliance: 100,
  cloud_technology: 100,
  billing_pricing: 100,

  increasePoints: (topic, points) =>
    set(state => ({
      [topic]: Math.min(state[topic] + points, 100),
    })),

  decreasePoints: (topic, points) =>
    set(state => ({
      [topic]: Math.max(state[topic] - points, 0),
    })),

  resetTopic: topic => set(() => ({ [topic]: 100 })),

  resetAll: () =>
    set(() => ({
      fundamental_cloud_concepts: 100,
      security_compliance: 100,
      cloud_technology: 100,
      billing_pricing: 100,
    })),

  getTopicPercentage: topic => {
    const state = get();
    return state[topic];
  },

  getTotalScore: () => {
    const state = get();
    return Math.round(
      (state.fundamental_cloud_concepts +
        state.security_compliance +
        state.cloud_technology +
        state.billing_pricing) /
        4
    );
  },

  getLowestScoringTopic: () => {
    const state = get();
    const topics: TopicGroup[] = [
      'fundamental_cloud_concepts',
      'security_compliance',
      'cloud_technology',
      'billing_pricing',
    ];
    const lowestTopic = topics.reduce((lowest, current) =>
      state[current] < state[lowest] ? current : lowest
    );
    return {
      topic: lowestTopic,
      score: state[lowestTopic],
    };
  },
}));
