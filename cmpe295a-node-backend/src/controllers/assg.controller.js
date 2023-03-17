const assgService = require('../services/assg.service');

// Create Assignmet
exports.createAssg = (req, res) =>{
    console.log("\nCREATE ASSIGNMENT");

    assgService.createAssg(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log("Assignment Exists");
            res.status(404).send(result);
        }
    })
}

// Get All Assignments
exports.getAll = (req, res) => {
    console.log("\nGET ALL ASSIGNMENTS");

    assgService.getAll((err, result) =>{
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

// Get Assignment
exports.getAssignment = (req, res) => {
    console.log("\nGET ASSIGNMENT: ", req.params.assgID);

    assgService.getAssignment(req.params.assgID, (err, result) => {
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

    assgService.getCourseAssgs(req.params.courseID, (err, result) => {
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