import firebase from "firebase";

interface name {
  first: string;
  last: string;
}

export interface LoginData {
  email: string;
  password: string;
  showError: boolean;
  error: string;
  loading: boolean;
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
  discord: string;
  categories: string[];
  showError: boolean;
  error: string;
  cats: Array<string>;
  loading: boolean;
}

export interface ResetData {
  email: string;
  showFb: boolean;
  isInvalid: boolean;
  feedback: string;
  debounce: boolean;
  last: string;
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

// .map(each => {
//   return each
//     .split(" ")
//     .map(word => {
//       return (
//         word.substring(0, 1).toUpperCase() +
//         word.substring(1, word.length).toLowerCase()
//       );
//     })
//     .join(" ");
// });
type question = string;

export async function getCategories() {
  const res = await firebase.functions().httpsCallable("getCategories")();

  return res.data.categories;
}

export async function getCategoriesMap() {
  const categories = await getCategories();
  let categoriesMap = await firebase
    .functions()
    .httpsCallable("getCategoriesMap")();

  categoriesMap = categoriesMap.data.categories;

  let map = {};
  for (let i = 0; i < categories.length; i++) {
    map[categories[i]] = categoriesMap[i];
  }
  return map;
}

export const map = {
  "hotel dieu shaver health and rehabilitation":
    "Hotel Dieu Shaver Health and Rehabilitation",
  "ite challenge": "ITE Challenge",
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
  "materials challenge": "Materials Challenge",
  "algorand challenge": "Algorand Challenge",
  "hypercare challenge": "Hypercare Challenge",
  "best uipath automation hack": "Best UiPath Automation Hack",
  "best domain registered with domain.com":
    "Best Domain Registered with Domain.com",
  "best use of google cloud": "Best use of Google Cloud",
  "best use of mongodb atlas": "Best use of MongoDB Atlas",
  "best use of blockstack": "Best use of Blockstack",
  "most creative radar.io hack": "Most Creative Radar.io Hack"
};
