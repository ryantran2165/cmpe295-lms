const assgModel = require('../models/assg.model');
const assgSubmissionModel = require('../models/assgSubmission.model');
const s3 = require('../s3/upload');

// Create Assignment
exports.createAssg = async (reqData, result) => {

    const name = reqData.name;
    const course = reqData.course;
    const points = reqData.points;
    const dueDate = reqData.dueDate;
    const solution = reqData.solution;
    const testCases = reqData.testCases;
    const instructions = reqData.instructions;

    try{
        await assgModel.create({
            name,
            course,
            points,
            dueDate,
            solution,
            testCases,
            instructions
        });

        result(null, {status: true, payload:reqData, message: "Assignment Created"});
    }

    catch(err){
        result(null, {status: false, message:"Assignment exists", err});
    }
}


// Get All Assignments
exports.getAll = async (result) => {

    try{
        const assgs = await assgModel.find().populate('course');
        result(null, assgs);
    }
    catch(err){
        result(null, err);
    }
}

// Get Assignment
exports.getAssignment = async(assgID , result) => {

    try{
        const assignment = await assgModel.findById(assgID);
        result(null, assignment);
    }
    catch(err){
        result(null, err);
    }
}

// Get Course Assignments
exports.getCourseAssgs = async(courseID , result) => {

    try{
        const assignments = await assgModel.find({course: courseID});
        result(null, assignments);
    }
    catch(err){
        result(null, err);
    }
}

// Submit Assignment
exports.submitAssg = async(assignment, req, result) => {

    const { student, answer, score, dateSubmitted } = req.body;

    // S3 File
    const fileURL = await req.file.location;
    console.log(req.file.location)

    try{
        
       await assgSubmissionModel.create({ 
            assignment, 
            student, 
            fileURL, 
            answer, 
            score,
            dateSubmitted 
        });

        result(null, {status: true, payload:req.body, file: fileURL, message: "Assignment Submitted"});
    }
    catch(err){
        result(null, {status: false, message:"Error Submitting", err});
    }
}