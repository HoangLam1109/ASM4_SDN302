import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz } from '../../types';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  userAnswers: { [questionId: string]: string };
  score: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  userAnswers: {},
  score: null,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
      state.loading = false;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.userAnswers = {};
      state.score = null;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.userAnswers = {};
      state.score = null;
    },
  },
});

export const {
  setQuizzes,
  setCurrentQuiz,
  setAnswer,
  setScore,
  setLoading,
  setError,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
