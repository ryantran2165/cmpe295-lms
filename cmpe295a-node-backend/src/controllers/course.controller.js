const courseService = require('../services/course.service');

// Create Course
exports.createCourse = (req, res) => {
    console.log("\nCREATE COURSE");

    courseService.createCourse(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log("Course Exists");
            res.status(404).send(result);
        }
    })
}

// Get All Courses
exports.getAll = (req, res) => {
    console.log("\nGET ALL COURSES");

    courseService.getAll((err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}

// Get Instructor Courses
exports.getInstrCourses = (req, res) => {
    console.log("\nGET INSTRUCTOR COURSES FOR: ", req.params.instructorID);

    courseService.getInstrCourses(req.params.instructorID, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result)
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}

// Get Student Courses