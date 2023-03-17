var express = require('express');
var router = express.Router();

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

module.exports = router;