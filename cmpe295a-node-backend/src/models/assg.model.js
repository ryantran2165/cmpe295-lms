const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Assignment Schema
const assgSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    points:{
        type: Number,
        required: true
    },
    dueDate:{
        //type: Date,
        type: String,
        required: true
    },
    solution:{
        type: String,
        required: true
    },
    testCases:{
        type: Array,
        //required: true
    },
    instructions:{
        type: String,
        reqiured: true
    }

});

const assgModel = mongoose.model('assignments', assgSchema);

module.exports = assgModel;