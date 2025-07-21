import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/quizzes/results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(res.data);
      } catch (err) {
        setError('Failed to fetch results');
      }
    };
    fetchResults();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Your Quiz Results</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {results.map(r => (
          <li key={r._id}>
            <b>{r.quiz?.title || 'Quiz'}</b>: {r.score} points on {new Date(r.submittedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results; 