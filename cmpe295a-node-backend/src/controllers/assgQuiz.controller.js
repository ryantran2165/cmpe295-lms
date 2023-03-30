const assgQuizService = require('../services/assgQuiz.service');

// Create Assignmet/Quiz
exports.createAssgQuiz = (req, res) =>{
    console.log("\nCREATE ASSIGNMENT/QUIZ");

    assgQuizService.createAssgQuiz(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log("Error while creating...");
            res.status(404).send(result);
        }
    })
}

// Get All AssignmentsQuizzes
exports.getAll = (req, res) => {
    console.log("\nGET ALL ASSIGNMENTS/QUIZZES");

    assgQuizService.getAll((err, result) =>{
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

// Get All for Course
exports.getAllCourse = (req, res) => {
    console.log("\nGET ASSIGNMENTS/QUIZZES FOR COURSE: ", req.params.courseID);

    assgQuizService.getAllCourse(req.params.courseID, (err, result) => {
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


// Get AssignmentQuiz
exports.getAssgQuiz = (req, res) => {
    console.log("\nGET ASSIGNMENT: ", req.params.assgID);

    assgQuizService.getAssgQuiz(req.params.assgID, (err, result) => {
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

// Get Course Assignments
exports.getCourseAssgs = (req, res) => {
    console.log("\nGET ASSIGNMENTS FOR COURSE: ", req.params.courseID);

    assgQuizService.getCourseAssgs(req.params.courseID, (err, result) => {
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
    console.log("\nGET QUIZZES FOR COURSE: ", req.params.courseID);

    assgQuizService.getCourseQuizzes(req.params.courseID, (err, result) => {
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

// Submit Assignment
exports.submit = (req, res) => {
    console.log("\nSUBMITTING FOR: ", req.params.assgID);

    console.log("BODY: ",req.body);

    assgQuizService.submit(req.params.assgID, req, (err, result) =>{
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