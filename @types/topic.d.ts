type Topic =
  | 'fundamental_cloud_concepts'
  | 'security_compliance'
  | 'cloud_technology'
  | 'billing_pricing_support';

type TopicStats = Record<Topic, number>;

type TopicStatsDetail = Record<Topic, { correct: number; errors: number }>;
