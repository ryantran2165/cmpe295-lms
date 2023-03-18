var express = require('express');
var router = express.Router();

// import quiz controller
const quizController = require('../controllers/quiz.controller');

// Create quiz            POST
router.post('/', quizController.createQuiz);

// Get All Quizzes         GET
router.get('/', quizController.getAll);

// Get Course Quizzes      GET
router.get('/bycourse/:courseID', quizController.getCourseQuizzes);

module.exports = router;