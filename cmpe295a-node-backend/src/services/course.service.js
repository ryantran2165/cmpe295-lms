const courseModel = require('../models/course.model');

// Create Course
exports.createCourse = async (reqData, result) => {

    const name = reqData.name
    const instructor = reqData.instructor;
    const students = reqData.students;

    try{
        await courseModel.create({
            name, 
            instructor,
            students
        });

        result(null, {status: true, payload:reqData, message: "Course Created"});
    }
    catch(err){
        result(null, {status: false, message: "Course Exists", err});
    }
}

// Get All Courses
exports.getAll = async (result) => {

    try{
        const courses = await courseModel.find().populate('instructor');
        result(null, courses);
    }
    catch(err){
        result(null, err);
    }
}

// Get Instructor Courses

// Get Student Courses