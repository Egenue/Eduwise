const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const Quiz = require('../models/Quiz');

router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.post('/', quizController.createQuiz);
router.post('/:id/submit', quizController.submitQuiz);
router.get('/results', quizController.getUserResults);
router.get('/admin', quizController.getAllQuizzesAdmin);
router.patch('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router; 