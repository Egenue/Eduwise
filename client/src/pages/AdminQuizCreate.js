import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';

function AdminQuizCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [importParams, setImportParams] = useState({
    amount: 10,
    category: '',
    difficulty: '',
    type: '',
    title: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch OpenTDB categories on mount
    axios.get('https://opentdb.com/api_category.php')
      .then(res => setCategories(res.data.trivia_categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleImportChange = (e) => {
    setImportParams({ ...importParams, [e.target.name]: e.target.value });
  };

  const handleImportFromOpenTDB = async () => {
    setImporting(true);
    setError(null);
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/quiz/opentdb/import`, importParams, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      navigate('/admin/quizzes');
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setImporting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.post(`${process.env.REACT_APP_API_URL}/api/quizzes`, {
        title,
        description,
        questions,
        createdBy: auth.currentUser.uid,
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      navigate('/admin/quizzes');
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      console.error('Quiz creation error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Create Quiz</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* OpenTDB Import Section */}
      <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 24, borderRadius: 8 }}>
        <h3>Import from OpenTDB</h3>
        <input
          type="number"
          name="amount"
          value={importParams.amount}
          onChange={handleImportChange}
          placeholder="Number of Questions"
          min={1}
          max={50}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <select
          name="category"
          value={importParams.category}
          onChange={handleImportChange}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          name="difficulty"
          value={importParams.difficulty}
          onChange={handleImportChange}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          name="type"
          value={importParams.type}
          onChange={handleImportChange}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        >
          <option value="">All Types</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
        <input
          type="text"
          name="title"
          value={importParams.title}
          onChange={handleImportChange}
          placeholder="Quiz Title (optional)"
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <input
          type="text"
          name="description"
          value={importParams.description}
          onChange={handleImportChange}
          placeholder="Quiz Description (optional)"
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        />
        <button onClick={handleImportFromOpenTDB} disabled={importing} style={{ margin: '10px 0', width: '100%' }}>
          {importing ? 'Importing...' : 'Import from OpenTDB'}
        </button>
      </div>
      {/* Existing manual quiz creation form */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz Title"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quiz Description"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        {questions.map((q, index) => (
          <div key={index} style={{ margin: '20px 0' }}>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              placeholder={`Question ${index + 1}`}
              style={{ display: 'block', margin: '10px 0', width: '100%' }}
            />
            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                placeholder={`Option ${optIndex + 1}`}
                style={{ display: 'block', margin: '5px 0', width: '100%' }}
              />
            ))}
            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              placeholder="Correct Answer"
              style={{ display: 'block', margin: '10px 0', width: '100%' }}
            />
          </div>
        ))}
        <button onClick={handleAddQuestion} style={{ margin: '10px 0' }}>
          Add Question
        </button>
        <button onClick={handleSubmit} style={{ margin: '10px', width: '100%' }}>
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default AdminQuizCreate;