const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Quiz Schema
const quizSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true,
    },
    points:{
        type: Number,
        required: true
    },
    dueDate:{
        // type: Date,
        type: String,
        required: true,
    },
    questions:{
        type: Array,
        required: true,
    },
})

const quizModel = mongoose.model("quizzes", quizSchema);

module.exports = quizModel;