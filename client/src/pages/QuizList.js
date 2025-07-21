import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quizzes`);
        setQuizzes(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Available Quizzes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz._id}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <p>Questions: {quiz.questions.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizList;