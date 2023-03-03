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

// Get Course Assignments