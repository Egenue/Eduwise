import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminQuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editQuiz, setEditQuiz] = useState({ title: '', questions: [] });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/quizzes/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (err) {
      setError('Failed to fetch quizzes');
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Quiz deleted!');
      fetchQuizzes();
    } catch (err) {
      setError('Failed to delete quiz');
    }
  };

  const startEdit = (quiz) => {
    setEditId(quiz._id);
    setEditQuiz({ title: quiz.title, questions: quiz.questions });
  };

  const handleEditChange = (field, value) => {
    setEditQuiz({ ...editQuiz, [field]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/quizzes/${editId}`, editQuiz, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Quiz updated!');
      setEditId(null);
      fetchQuizzes();
    } catch (err) {
      setError('Failed to update quiz');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Quiz Management</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q._id}>
              <td>
                {editId === q._id ? (
                  <input value={editQuiz.title} onChange={e => handleEditChange('title', e.target.value)} />
                ) : (
                  q.title
                )}
              </td>
              <td>{q.questions.length}</td>
              <td>
                {editId === q._id ? (
                  <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <button onClick={() => startEdit(q)}>Edit</button>
                    <button onClick={() => handleDelete(q._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminQuizManagement; 