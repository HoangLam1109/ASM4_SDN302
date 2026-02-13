import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store/store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import QuizList from './components/QuizList';
import TakeQuiz from './components/TakeQuiz';
import QuizForm from './components/QuizForm';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <QuizList />
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <PrivateRoute>
                  <TakeQuiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz/create"
              element={
                <PrivateRoute adminOnly={true}>
                  <QuizForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz/edit/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <QuizForm />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
