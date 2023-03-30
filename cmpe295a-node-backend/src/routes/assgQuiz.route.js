var express = require('express');
var router = express.Router();
const upload = require('../s3/upload')

// import assg controller
const assgQuizController = require('../controllers/assgQuiz.controller');

// Create Assignment/Quiz       POST
router.post('/', assgQuizController.createAssgQuiz);

// Get All                      GET
router.get('/', assgQuizController.getAll);

// Get Course Assgs             GET
router.get('/course/:courseID', assgQuizController.getAllCourse);

// Get Assignment               GET
router.get('/:assgID', assgQuizController.getAssgQuiz);

// Get Course Assgs             GET
router.get('/courseassignments/:courseID', assgQuizController.getCourseAssgs);

// Get Course Quizzes           GET
router.get('/coursequizzes/:courseID', assgQuizController.getCourseQuizzes);

// Create Submission            POST
router.post('/submit/:assgID', upload.array('fileURL'), assgQuizController.submit);

module.exports = router;