const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const jwt = require('jsonwebtoken');
const { fetchOpenTDBQuestions } = require('../services/opentdbService');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'title'); // Only return titles for list
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { quizId, answers } = req.body;
    const quiz = await require('../models/Quiz').findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    const result = new Result({ user: userId, quiz: quizId, answers, score });
    await result.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const results = await Result.find({ user: userId }).populate('quiz', 'title').sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllQuizzesAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.importOpenTDBQuiz = async (req, res) => {
  try {
    const { amount = 10, category, difficulty, type } = req.body;
    // req.user is set by verifyAdmin middleware
    const questions = await fetchOpenTDBQuestions({ amount, category, difficulty, type });
    const quiz = new Quiz({
      title: `OpenTDB ${category ? `Category ${category}` : 'Trivia'} ${difficulty || ''}`,
      description: `Quiz fetched from OpenTDB with ${amount} ${type || 'mixed'} questions`,
      questions,
      createdBy: req.user.uid,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 