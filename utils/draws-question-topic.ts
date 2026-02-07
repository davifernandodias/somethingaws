export const ALL_TOPICS: Topic[] = [
  'fundamental_cloud_concepts',
  'security_compliance',
  'cloud_technology',
  'billing_pricing_support',
];

export function switchTopicAfterTwoConsecutiveErrors(currentTopic: Topic) {
  const availableTopics = ALL_TOPICS.filter((topic) => topic !== currentTopic);

  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  return availableTopics[randomIndex];
}
