import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import QuizList from './pages/QuizList';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import AdminQuizCreate from './pages/AdminQuizCreate';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminQuizManagement from './pages/AdminQuizManagement';

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: 10, padding: 10 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
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