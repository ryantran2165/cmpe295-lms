const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
// Create Course
exports.createCourse = async (reqData, result) => {

    const name = reqData.name
    const instructor = reqData.instructor;
    const students = reqData.students;
    const description = reqData.description;

    try{
        course = await courseModel.create({
            name, 
            instructor,
            students,
            description
        });

        await userModel.findByIdAndUpdate(instructor, {$push: {courses: course._id}}); // Add course to instructor's courses list

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
        const courses = await courseModel.find({instructor: instructorID}).populate('instructor').populate('students');
        result(null, courses);
    }
    catch(err){
        result(null, err);
    }
}

// Enroll
exports.enroll = async(courseID, student, result) => {

    try{

        courseToEnroll = await courseModel.findById(courseID);
        
        if(courseToEnroll.students.includes(student)){
            result(null, {status: false, message: "Error: Student already Enrolled"});
        }
        else{
            await courseModel.findByIdAndUpdate(courseID, {$push: {students: student}}); // Add student to course
            await userModel.findByIdAndUpdate(student, {$push: {courses: courseID}}); // Add course to student
            result(null, {status: true, message: "Student Enrolled"});
        }
    }
    catch(err){
        result(null, {status: false, message: "Could not enroll student in course", err});
    }
}

// Get Student Courses
exports.getStudentCourses = async (studentID, result) => {

    try{

        courses = await courseModel.find({'students': studentID}).populate('instructor');
        result(null, courses);
    }
    catch(err){
        result(null, err);
    }
}