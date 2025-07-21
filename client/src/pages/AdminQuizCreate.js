import React, { useState } from 'react';
import axios from 'axios';

const AdminQuizCreate = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [message, setMessage] = useState('');

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === 'question') updated[idx].question = value;
    else if (field.startsWith('option')) updated[idx].options[parseInt(field.slice(-1))] = value;
    else if (field === 'correctAnswer') updated[idx].correctAnswer = parseInt(value);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/quizzes', { title, questions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Quiz created!');
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (err) {
      setMessage('Failed to create quiz');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Quiz Title:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        {questions.map((q, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <label>Question {idx + 1}:</label>
            <input value={q.question} onChange={e => handleQuestionChange(idx, 'question', e.target.value)} required style={{ width: '90%' }} />
            <div>
              {q.options.map((opt, oidx) => (
                <span key={oidx}>
                  <label>Option {oidx + 1}:</label>
                  <input value={opt} onChange={e => handleQuestionChange(idx, 'option' + oidx, e.target.value)} required />
                </span>
              ))}
            </div>
            <div>
              <label>Correct Answer:</label>
              <select value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)}>
                {q.options.map((_, oidx) => (
                  <option key={oidx} value={oidx}>Option {oidx + 1}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Create Quiz</button>
      </form>
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
    </div>
  );
};

export default AdminQuizCreate; 