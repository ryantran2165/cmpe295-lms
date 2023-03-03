const quizModel = require("../models/quiz.model");

// Create Quiz
exports.createQuiz = async (reqData, result) => {

    const name = reqData.name;
    const course = reqData.course;
    const points = reqData.points;
    const dueDate = reqData.dueDate;

    try{

        await quizModel.create({
            name,
            course,
            points,
            dueDate
        });

        result(null,  {status: true, payload:reqData, message: "Quiz Created"})
    }
    catch(err){
        result(null,  {status: true, message: "Quiz Exists"}, err);
    }
}

// Get All Quizzes
exports.getAll = async (result) => {
    try{
        const quizzes = await quizModel.find().populate("course");
        result(null, quizzes);
    }
    catch(err){
        result(null, err);
    }
}

// Get Course Quizzes