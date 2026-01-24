import { create } from 'zustand';
import { QuizState } from './interface/quiz-store-interface';

export const useControlPointsTopicsQuestions = create<QuizState>((set, get) => ({
  fundamental_cloud_concepts: 100,
  security_compliance: 100,
  cloud_technology: 100,
  billing_pricing: 100,

  increasePoints: (topic, points) =>
    set((state) => ({
      [topic]: Math.min(state[topic] + points, 100),
    })),

  decreasePoints: (topic, points) =>
    set((state) => ({
      [topic]: Math.max(state[topic] - points, 0),
    })),

  resetTopic: (topic) =>
    set(() => ({
      [topic]: 100,
    })),

  resetAll: () =>
    set(() => ({
      fundamental_cloud_concepts: 100,
      security_compliance: 100,
      cloud_technology: 100,
      billing_pricing: 100,
    })),

  getTopicPercentage: (topic) => get()[topic],

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
}));
