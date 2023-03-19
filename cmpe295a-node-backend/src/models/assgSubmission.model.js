const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assgSubmissionSchema = new Schema({
    assignment: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'assignments',
        required: true
    },
    student: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    fileURL:{
        type:String,
        // required:true
    },
    answer:{
        type:String,
        // required:true
    },
    score:{
        type: Number,
        // required:true
    },
    // feedback:{

    // },
    dateSubmitted:{
        //type: Date,
        type: String,
        // required: true
    }
})

const assgSubmissionModel = mongoose.model('assgSubmissions', assgSubmissionSchema);

module.exports = assgSubmissionModel;