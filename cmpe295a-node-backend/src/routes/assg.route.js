var express = require('express');
var router = express.Router();
const upload = require('../s3/upload')

// import assg controller
const assgController = require('../controllers/assg.controller');

// Create Assignment    POST
router.post('/', assgController.createAssg);

// Get All              GET
router.get('/', assgController.getAll);

// Get Assignment       GET
router.get('/:assgID', assgController.getAssignment);

// Get Course Assgs     GET
router.get('/bycourse/:courseID', assgController.getCourseAssgs);

// Create Submission    POST
router.post('/submit/:assgID', upload.single('fileURL'), assgController.submitAssg);

module.exports = router;