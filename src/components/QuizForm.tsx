import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { quizAPI,questionAPI } from "../services/api";
import { Quiz, Question } from "../types";

interface QuestionForm {
  text: string;
  Author: string;
  keywords: string[];
  options: string[];
  correctAnswerIndex: number | "";
}

const QuizForm: React.FC = () => {
  const normalizeQuestion = (q: any): Question => ({
    ...q,
    Author: q?.Author || q?.author || "",
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<QuestionForm>({
    text: "",
    Author: "",
    options: ["", "", "", ""],
    keywords: ["", "", "", ""],
    correctAnswerIndex: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    if (!id) return;
    try {
      const response = await quizAPI.getQuizById(id);
      setQuiz({
        title: response.data.title,
        description: response.data.description,
      });
      setQuestions(
        (response.data.questions || []).map((q: any) => normalizeQuestion(q)),
      );
    } catch (err) {
      toast.error("Failed to fetch quiz");
    }
  };

  const handleQuizChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const addQuestionToQuiz = async () => {
    if (!newQuestion.text || newQuestion.options.some((opt) => !opt)) {
      toast.warn("Điền đầy đủ câu hỏi và lựa chọn");
      return;
    }
    if (newQuestion.correctAnswerIndex === "") {
      toast.warn("Chọn đáp án đúng");
      return;
    }

    const normalizedIndex = Number(newQuestion.correctAnswerIndex);
    if (Number.isNaN(normalizedIndex)) {
      toast.error("Chỉ gửi index đáp án (số)");
      return;
    }
    if (!isEdit || !id) {
      setQuestions([
        ...questions,
        normalizeQuestion({
          ...newQuestion,
          correctAnswerIndex: normalizedIndex,
        }),
      ]);
      setNewQuestion({
        text: "",
        Author: "",
        options: ["", "", "", ""],
        keywords: ["", "", "", ""],
        correctAnswerIndex: "",
      });
      toast.success("Added question (pending save)");
      return;
    }

    try {
      const res = await quizAPI.addQuestionToQuiz(id, {
        ...newQuestion,
        correctAnswerIndex: normalizedIndex,
      });
      const createdQuestion = res.data.questionInfo || res.data;
      setQuestions([...questions, normalizeQuestion(createdQuestion)]);
      setNewQuestion({
        text: "",
        Author: "",
        options: ["", "", "", ""],
        keywords: ["", "", "", ""],
        correctAnswerIndex: "",
      });
      toast.success("Question added to quiz");
    } catch {
      toast.error("Thêm câu hỏi thất bại");
    }
  };

  const removeQuestion = async (index: number) => {
    const target = questions[index];

    if (!isEdit || !target?._id) {
      setQuestions(questions.filter((_, i) => i !== index));
      toast.info("Removed question (not saved yet)");
      return;
    }

    try {
      // Remove the specific question document by its id
      await questionAPI.deleteQuestion(target._id as string);
      setQuestions(questions.filter((_, i) => i !== index));
      toast.success("Removed question");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to remove question";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // if (questions.length === 0) {
    //   toast.warn("Please add at least one question");
    //   return;
    // }

    try {
      // Backend expects question objects for insertMany; only send ones chưa có _id
      const newQuestionPayload = questions
        .filter((q) => !q._id)
        .map((q) => {
          const author = (q as any).Author || (q as any).author;
          const idx =
            typeof q.correctAnswerIndex === "number"
              ? q.correctAnswerIndex
              : Number(
                  Math.max(
                    0,
                    q.options.findIndex(
                      (opt) => opt === q.correctAnswerIndex,
                    ),
                  ),
                );
          return {
            text: q.text,
            options: q.options,
            keywords: q.keywords,
            correctAnswerIndex: idx,
            Author: typeof author === "string" ? author : author?._id,
          };
        });

      if (isEdit && id) {
        await quizAPI.updateQuiz(id, quiz);
        if (newQuestionPayload.length > 0) {
          await quizAPI.addManyQuestionsToQuiz(id, newQuestionPayload as any);
        }
        toast.success("Quiz updated successfully");
      } else {
        const quizRes = await quizAPI.createQuiz(quiz);
        const quizId = quizRes.data._id;
        if (newQuestionPayload.length > 0) {
          await quizAPI.addManyQuestionsToQuiz(
            quizId,
            newQuestionPayload as any,
          );
        }
        toast.success("Quiz created successfully");
      }
      navigate("/");
    } catch (err) {
      toast.error("Failed to save quiz");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Quiz" : "Create New Quiz"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-body">
            <h4>Quiz Information</h4>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={quiz.title}
                onChange={handleQuizChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={quiz.description}
                onChange={handleQuizChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h4>Questions ({questions.length})</h4>
            {questions.map((q, index) => (
              <div key={index} className="border p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <h6>
                    Question {index + 1}: {q.text}
                  </h6>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove
                  </button>
                </div>
                <p className="mb-1">
                  {(() => {
                    const author = (q as any).Author || (q as any).author;
                    if (typeof author === "string") return author || "Unknown";
                    return author?.username || "Unknown";
                  })()}
                </p>
                <p className="mb-1">
                  Keywords: {q.keywords?.filter(Boolean).join(", ") || "—"}
                </p>
                <p className="mb-1">Options: {q.options?.join(", ") || "—"}</p>
                <p className="text-success mb-0">
                  {typeof q.correctAnswerIndex === "number"
                    ? `Correct: ${q.options?.[q.correctAnswerIndex] ?? q.correctAnswerIndex}`
                    : `Correct: ${q.correctAnswerIndex || "—"}`}
                </p>
              </div>
            ))}

            <hr />
            <h5>Add New Question</h5>
            <div className="mb-3">
              <label className="form-label">Question Text</label>
              <input
                type="text"
                name="text"
                className="form-control"
                value={newQuestion.text}
                onChange={handleQuestionChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Keywords (comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="react, redux, api"
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    keywords: e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Options</label>
              {newQuestion.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                name="correctAnswer"
                className="form-control"
                value={
                  newQuestion.correctAnswerIndex === ""
                    ? ""
                    : String(newQuestion.correctAnswerIndex)
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setNewQuestion({
                    ...newQuestion,
                    correctAnswerIndex: value,
                  });
                }}
              >
                <option value="">Select correct answer</option>
                {newQuestion.options.map((opt, index) => (
                  <option key={index} value={index}>
                    {opt || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addQuestionToQuiz}
            >
              Add Question
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
