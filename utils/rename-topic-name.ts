export function renameTopicGroup(
  topicName: string | null | undefined,
  reverseName?: boolean
): TopicGroup | undefined {
  switch (topicName) {
    case 'Conceitos de Nuvem':
      return 'fundamental_cloud_concepts';
    case 'Conformidade & Segurança':
      return 'security_compliance';
    case 'Serviços básicos da AWS':
      return 'cloud_technology';
  }
}

export function reveseRenameTopicGroup(topicName: string | null | undefined) {
  switch (topicName) {
    case 'fundamental_cloud_concepts':
      return 'Conceitos de Nuvem';
    case 'security_compliance':
      return 'Conformidade & Segurança';
    case 'cloud_technology':
      return 'Serviços básicos da AWS';
  }
}
