import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuiz(res.data);
      } catch (err) {
        setError('Failed to load quiz');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (idx) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
    } else {
      // Submit answers to backend
      const submit = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post(
            `http://localhost:5000/api/quizzes/${quiz._id}/submit`,
            { quizId: quiz._id, answers: newAnswers },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setScore(res.data.score);
        } catch (err) {
          setError('Failed to submit quiz');
        }
      };
      submit();
    }
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!quiz) return <div>Loading...</div>;
  if (score !== null) return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>{quiz.title}</h2>
      <h3>Your Score: {score} / {quiz.questions.length}</h3>
    </div>
  );

  const q = quiz.questions[current];
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>{quiz.title}</h2>
      <h3>Question {current + 1} of {quiz.questions.length}</h3>
      <p>{q.question}</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {q.options.map((opt, idx) => (
          <li key={idx}>
            <button style={{ margin: 4 }} onClick={() => handleAnswer(idx)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz; 