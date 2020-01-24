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
  categories: [string];
}

export interface Table {
  name: string;
  devlink: string;
  categories: [string];
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
export const categories = [
  "centre challenge",
  "hotel dieu shaver health and rehabilitation",
  "ite challenge",
  "kyle arscott challenge",
  "beasley neighbourhood association challenge",
  "best overall hack",
  "best education hack",
  "best finance hack",
  "best environment hack",
  "best health hack",
  "best quality of life/productivity hack",
  "innovation factory challenge",
  "td challenge",
  "arcelormittal dofasco challenge",
  "materials challenge",
  "algorand challenge"
].map(each => {
  return each
    .split(" ")
    .map(word => {
      return (
        word.substring(0, 1).toUpperCase() +
        word.substring(1, word.length).toLowerCase()
      );
    })
    .join(" ");
});
type question = string;

export const map = {
  "centre challenge": "Centre Challenge",
  "hotel dieu shaver health and rehabilitation":
    "Hotel Dieu Shaver Health and Rehabilitation",
  "ite challenge": "ITE Challenge",
  "kyle arscott challenge": "Kyle Arscott Challenge",
  "beasley neighbourhood association challenge":
    "Beasley Neighbourhood Association Challenge",
  "best overall hack": "Best Overall Hack",
  "best education hack": "Best Education Hack",
  "best finance hack": "Best Finance Hack",
  "best environment hack": "Best Environment Hack",
  "best health hack": "Best Health Hack",
  "best quality of life/productivity hack":
    "Best Quality of Life/Productivity Hack",
  "innovation factory challenge": "Innovation Factory Challenge",
  "td challenge": "TD Challenge",
  "arcelormittal dofasco challenge": "Arcelormittal Dofasco Challenge",
  "Materials Challenge": "Materials Challenge",
  "Algorand Challenge": "Algorand Challenge"
};
