export function switchTopicAfterTwoConsecutiveErrors(currentTopic: string) {
  const topics = [
    'fundamental_cloud_concepts',
    'security_compliance',
    'cloud_technology',
    'billing_pricing_support',
  ];

  const availableTopics = topics.filter((topic) => topic !== currentTopic);

  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  return availableTopics[randomIndex];
}
