import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  let user = null;
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = payload;
      isAdmin = !!payload.isAdmin;
    }
  } catch {}

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome{user ? `, ${user.name || user.email}` : ''}!</p>
      <ul>
        <li><Link to="/quizzes">Take a Quiz</Link></li>
        <li><Link to="/results">View Results</Link></li>
        {isAdmin && <li><Link to="/admin/quiz-create">Create a Quiz</Link></li>}
      </ul>
    </div>
  );
};

export default Dashboard; 