import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setQuizzes, setLoading, setError } from '../store/slices/quizSlice';
import { quizAPI } from '../services/api';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const QuizList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizzes, loading } = useAppSelector((state) => state.quiz);
  const { isAdmin } = useAppSelector((state) => state.auth);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    dispatch(setLoading(true));
    try {
      const response = await quizAPI.getAllQuizzes();
      dispatch(setQuizzes(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch quizzes'));
    }
  };

  const handleTakeQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const openDeleteModal = (quizId: string, title: string) => {
    setDeleteTarget({ id: quizId, title });
    setDeleteError('');
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError('');
  };

  const confirmDeleteQuiz = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await quizAPI.deleteQuiz(deleteTarget.id);
      toast.success('Delete success');
      closeDeleteModal();
      fetchQuizzes();
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete quiz');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Available Quizzes</h2>
          {isAdmin && (
            <button
              className="btn btn-success"
              onClick={() => navigate('/quiz/create')}
            >
              Add Quiz
            </button>
          )}
        </div>

        {quizzes.length === 0 ? (
          <div className="alert alert-info">No quizzes available</div>
        ) : (
          <div className="row">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{quiz.title}</h5>
                    <p className="card-text">{quiz.description}</p>
                    <p className="text-muted">
                      {quiz.questions?.length || 0} questions
                    </p>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleTakeQuiz(quiz._id)}
                    >
                      Take Quiz
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => openDeleteModal(quiz._id, quiz.title)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Quiz</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeDeleteModal} disabled={isDeleting}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete "{deleteTarget.title}"?</p>
                {deleteError && <div className="alert alert-danger mb-0">{deleteError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal} disabled={isDeleting}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteQuiz} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizList;
