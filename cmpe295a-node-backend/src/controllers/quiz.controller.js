const quizService = require('../services/quiz.service');

// Create Quiz
exports.createQuiz = (req, res) => {
    console.log("\nCREATE QUIZ");

    quizService.createQuiz(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log("Error creating quiz");
            res.status(404).send(result);
        }
    })
}

// Get All Quizzes
exports.getAll = (req, res) => {
    console.log("\nGET ALL QUIZZES");

    quizService.getAll((err, result) => {
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

// Get Course Quizzes     
exports.getCourseQuizzes = (req, res) => {
    console.log("\nGET COURSE QUIZZES FOR: ", req.params.courseID);

    quizService.getCourseQuizzes(req.params.courseID, (err, result) => {
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