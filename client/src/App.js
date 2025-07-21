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
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in');
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h2>Login</h2>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Log In</button>
        </div>
      </div>
    </div>
  );
}

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


export default App;