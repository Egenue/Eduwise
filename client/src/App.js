import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import PrivateRoute from './components/PrivateRoute.js';
import QuizList from './pages/QuizList.js';
import Quiz from './pages/Quiz.js';
import Results from './pages/Results.js';
import AdminQuizCreate from './pages/AdminQuizCreate.js';
import AdminUserManagement from './pages/AdminUserManagement.js';
import AdminQuizManagement from './pages/AdminQuizManagement.js';

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: 10, padding: 10 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/quizzes">Quiz</Link>
        <Link to="/results">Results</Link>
        <Link to="/admin/quiz-create">Create Quiz</Link>
        <Link to="/admin/users">User Management</Link>
        <Link to="/admin/quizzes">Quiz Management</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/quizzes" element={<PrivateRoute><QuizList /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/admin/quiz-create" element={<PrivateRoute><AdminQuizCreate /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute><AdminUserManagement /></PrivateRoute>} />
        <Route path="/admin/quizzes" element={<PrivateRoute><AdminQuizManagement /></PrivateRoute>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
