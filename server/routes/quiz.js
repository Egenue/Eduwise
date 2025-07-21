const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const { fetchOpenTDBQuestions } = require('../services/opentdbService');

const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

const verifyAdmin = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

router.post('/', verifyAdmin, async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user.uid,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /opentdb/import - Admin only: Import quiz from OpenTDB and save to DB
router.post('/opentdb/import', verifyAdmin, async (req, res) => {
  try {
    const { amount = 10, category, difficulty, type, title, description } = req.body;
    const opentdbQuestions = await fetchOpenTDBQuestions(amount, category, difficulty, type);
    if (!opentdbQuestions || opentdbQuestions.length === 0) {
      return res.status(400).json({ error: 'No questions fetched from OpenTDB' });
    }
    // Map OpenTDB questions to Quiz schema
    const questions = opentdbQuestions.map(q => {
      const options = [...q.incorrect_answers, q.correct_answer];
      // Shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return {
        questionText: q.question,
        options,
        correctAnswer: q.correct_answer,
      };
    });
    const quiz = new Quiz({
      title: title || 'OpenTDB Quiz',
      description: description || 'Imported from OpenTDB',
      questions,
      createdBy: req.user.uid,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;