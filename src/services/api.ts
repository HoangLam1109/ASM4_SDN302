import axios, { AxiosInstance } from 'axios';
import { LoginCredentials, SignupData, Quiz, Question } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials: LoginCredentials) => api.post('/login', credentials),
  signup: (userData: SignupData) => api.post('/signup', userData),
  getAllUsers: () => api.get('/users'),
  createUser: (userData: SignupData) => api.post('/users', userData),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, userData: Partial<SignupData>) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// Quiz APIs
export const quizAPI = {
  getAllQuizzes: () => api.get('/quizzes'),
  getQuizById: (id: string) => api.get(`/quizzes/${id}`),
  createQuiz: (quizData: Partial<Quiz>) => api.post('/quizzes', quizData),
  updateQuiz: (id: string, quizData: Partial<Quiz>) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id: string) => api.delete(`/quizzes/${id}`),
  getQuestionsByKeyword: (quizId: string, keyword?: string) => 
    api.get(`/quizzes/${quizId}/populate`, { params: { keyword } }),
  addQuestionToQuiz: (quizId: string, questionData: any) =>
  api.post(`/quizzes/${quizId}/question`, questionData),
  // Accepts an array of question objects; backend expects a plain array, not a wrapped payload
  addManyQuestionsToQuiz: (quizId: string, questions: Partial<Question>[]) => 
    api.post(`/quizzes/${quizId}/questions`, questions),
  deleteQuestionFromQuiz: (id: string) => api.delete(`/questions/${id}`)
};

// Question APIs
export const questionAPI = {
  getAllQuestions: () => api.get('/questions'),
  createQuestion: (questionData: Partial<Question>) => api.post('/questions', questionData),
  updateQuestion: (id: string, questionData: Partial<Question>) => 
    api.put(`/questions/${id}`, questionData),
  getQuestionById: (id: string) => api.get(`/questions/${id}`),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),
};

export default api;
