const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
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
        const courses = await courseModel.find().populate('instructor').populate('students');
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

// Enroll
exports.enroll = async(courseID, student, result) => {

    try{
        await courseModel.findByIdAndUpdate(courseID, {$push: {students: student}}); // Add student to course
        await userModel.findByIdAndUpdate(student, {$push: {courses: courseID}}); // Add course to student
        result(null, {status: true, message: "Student Enrolled"});
    }
    catch(err){
        result(null, {status: false, message: "Could not enroll student in course", err});
    }
}

// Get Student Courses