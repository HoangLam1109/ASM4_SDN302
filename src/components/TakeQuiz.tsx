import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  setCurrentQuiz,
  setAnswer,
  setScore,
  resetQuiz,
  setLoading,
} from "../store/slices/quizSlice";
import { quizAPI } from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentQuiz, userAnswers, score, loading } = useAppSelector(
    (state) => state.quiz,
  );
  const { isAdmin } = useAppSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
    return () => {
      dispatch(resetQuiz());
    };
  }, [id]);

  const fetchQuiz = async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const response = await quizAPI.getQuizById(id);
      dispatch(setCurrentQuiz(response.data));
    } catch (err) {
      alert("Failed to fetch quiz");
      navigate("/");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    dispatch(setAnswer({ questionId, answer }));
  };

  const handleSubmit = () => {
    if (!currentQuiz) return;

    if (Object.keys(userAnswers).length !== currentQuiz.questions.length) {
      alert("Please answer all questions");
      return;
    }

    // Calculate score locally (correctAnswerIndex có thể là index số hoặc giá trị string)
    let correctCount = 0;
    currentQuiz.questions.forEach((question) => {
      const correctValue =
        typeof question.correctAnswerIndex === "number"
          ? question.options?.[question.correctAnswerIndex]
          : question.correctAnswerIndex;

      if (userAnswers[question._id] === correctValue) {
        correctCount++;
      }
    });

    dispatch(setScore(correctCount));
    setSubmitted(true);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!currentQuiz) {
    return null;
  }

  if (submitted && score !== null) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-body text-center">
            <h2>Quiz Completed!</h2>
            <h3 className="mt-4">
              Your Score: {score} / {currentQuiz.questions.length}
            </h3>
            <p className="mt-3">
              Percentage:{" "}
              {((score / currentQuiz.questions.length) * 100).toFixed(2)}%
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/")}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
        <div>
          <h2 className="mb-1">{currentQuiz.title}</h2>
          <p className="text-muted mb-0">{currentQuiz.description}</p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-outline-primary mt-3 mt-md-0"
            onClick={() => navigate(`/quiz/edit/${currentQuiz._id}`)}
          >
            Add Question
          </button>
        )}
      </div>

      <div className="mt-4">
        {currentQuiz.questions.map((question, index) => (
          <div key={question._id} className="card mb-3">
            <div className="card-body">
              <h5>
                Question {index + 1}: {question.text}
              </h5>
              {question.keywords?.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {question.keywords.map((kw, i) => (
                    <span key={i} className="badge bg-secondary">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id}
                      id={`q${question._id}-opt${optIndex}`}
                      checked={userAnswers[question._id] === option}
                      onChange={() => handleAnswerChange(question._id, option)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`q${question._id}-opt${optIndex}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4 mb-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button className="btn btn-success" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;
