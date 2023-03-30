const assgQuizModel = require('../models/assgQuiz.model');
const submissionModel = require('../models/submission.model');

// Create Assignment
exports.createAssgQuiz = async (reqData, result) => {

    const course = reqData.course;
    const type = reqData.type;
    const name = reqData.name;
    const description = reqData.description;
    const dueDate = reqData.dueDate;
    const totalPoints = reqData.totalPoints;
    const questions = reqData.questions;
    

    try{
        await assgQuizModel.create({
            course,
            type,
            name,
            description,
            dueDate,
            totalPoints,
            questions
        });

        result(null, {status: true, payload:reqData, message: "Created Successfully"});
    }

    catch(err){
        result(null, {status: false, message:"Error while creating", err});
    }
}


// Get All Assignments
exports.getAll = async (result) => {

    try{
        const assgs = await assgQuizModel.find().populate('course');
        result(null, assgs);
    }
    catch(err){
        result(null, err);
    }
}

// Get All Assignments/Quizzes for Course
exports.getAllCourse = async(courseID , result) => {

    try{
        const assgsQuizzes = await assgQuizModel.find({course: courseID});
        result(null, assgsQuizzes);
    }
    catch(err){
        result(null, err);
    }
}

// Get Assignment
exports.getAssgQuiz = async(assgID , result) => {

    try{
        const assignment = await assgQuizModel.findById(assgID);
        result(null, assignment);
    }
    catch(err){
        result(null, err);
    }
}

// Get Course Assignments
exports.getCourseAssgs = async(courseID , result) => {

    try{
        const assignments = await assgQuizModel.find({'course': courseID, 'type': "assignment"});
        result(null, assignments);
    }
    catch(err){
        result(null, err);
    }
}

// Get Course Quizzes
exports.getCourseQuizzes = async(courseID , result) => {

    try{
        const quizzes = await assgQuizModel.find({'course': courseID, 'type': "quiz"});
        result(null, quizzes);
    }
    catch(err){
        result(null, err);
    }
}

// Submit
exports.submit = async(assignmentQuiz, req, result) => {

    const { student, answers, score, dateSubmitted } = req.body;
    
    if (req.files.length > 0) {
         for(let i = 0; i < req.files.length; i++){
            answers[i].fileURL = req.files[i].location;
         }    
    }

    try{
        
       await submissionModel.create({ 
            assignmentQuiz,
            student,
            answers,
            score,
            dateSubmitted
        });

        result(null, {status: true, payload:req.body, message: "Submitted Successfully"});
    }
    catch(err){
        result(null, {status: false, message:"Error Submitting", err});
    }
}