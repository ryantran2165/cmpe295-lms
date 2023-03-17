const assgModel = require('../models/assg.model');
const AssgModel = require('../models/assg.model');

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
        await AssgModel.create({
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
        const assgs = await AssgModel.find().populate('course');
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