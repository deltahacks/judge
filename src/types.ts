interface name {
  first: string;
  last: string;
}

export interface Judge {
  name: name;
  contact: string;
  org: string;
  categories: [category];
}

export interface Table {
  name: string;
  devlink: string;
  categories: [category];
  Reviews: [JudgeReviews];
}
export interface Questions {
  question: question;
  score: number;
}

export interface JudgeReviews {
  email: string;
  categories: [string];
  questions: [Questions];
  final: number;
}

type category = string;
type question = string;
