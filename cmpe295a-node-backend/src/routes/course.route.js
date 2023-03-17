var express = require('express');
var router = express.Router();

// import course controller
const courseController = require('../controllers/course.controller');

// Create Course            POST
router.post('/', courseController.createCourse);

// Get All Courses          GET
router.get('/', courseController.getAll);

// Get Instructor Courses   GET
router.get('/byinstructor/:instructorID', courseController.getInstrCourses);

// Get Student Courses      GET
// router.get('/bystudent/:student_ID', courseController.getStudentCourses);

module.exports = router;