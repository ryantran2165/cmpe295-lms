const courseModel = require('../models/course.model');

// Create Course
exports.createCourse = async (reqData, result) => {

    const name = reqData.name
    const instructor = reqData.instructor;
    const students = reqData.students;
    const description = reqData.description;

    try{
        await courseModel.create({
            name, 
            instructor,
            students,
            description
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
exports.getInstrCourses = async (instructorID, result) => {

    try{
        const courses = await courseModel.find({instructor: instructorID})
        result(null, courses);
    }
    catch(err){
        result(null, err);
    }
}

// Get Student Courses