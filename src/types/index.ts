export interface User {
  _id: string;
  username: string;
  admin: boolean;
}

export interface Question {
  _id: string;
  text: string;
  keywords: string[];
  options: string[];
  correctAnswerIndex: string | number;
  Author?: string | User;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuizSubmission {
  answers: { [questionId: string]: string };
}

export interface QuizResult {
  score: number;
  total: number;
}
