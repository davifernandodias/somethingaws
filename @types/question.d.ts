type QuestionResponse = {
  alternative: string;
  because: string;
  rep: boolean;
};

type Question = {
  id: number;
  title: string;
  group_by_topic: string;
  accept_two_alternatives: boolean;
  level_of_complexity: number;
  response: QuestionResponse[];
};
