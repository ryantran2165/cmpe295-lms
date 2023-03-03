var express = require('express');
var router = express.Router();

// import assg controller
const assgController = require('../controllers/assg.controller');

// Create Assignment    POST
router.post('/', assgController.createAssg);

// Get All              GET
router.get('/', assgController.getAll);

// Get Course Assgs     GET
//router.get('/bycourse/:course_ID', assgController.getCourseAssgs);

// Get Assignment       GET
//router.get('/:assg_ID', assgController.getAssg);

module.exports = router;