interface name {
  first: string;
  last: string;
}

export interface LoginData {
  email: string;
  password: string;
  showError: boolean;
  error: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first: string;
  last: string;
  secret: string;
  role: string;
  organization?: string;
  contact?: string;
  categories: string[];
  showError: boolean;
  error: string;
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
  reviews: [JudgeReviews];
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
export const categories = ["General", "JS", "Java", "Python"];
type category = "General" | "JS" | "Java" | "Python";
type question = string;
