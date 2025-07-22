const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
require('../models/Quiz');
const { fetchOpenTDBQuestions } = require('../services/opentdbService');
const quizController = require('../controllers/quizController');

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

router.post('/opentdb', verifyAdmin, quizController.importOpenTDBQuiz);

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

module.exports = router;