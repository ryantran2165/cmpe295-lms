const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Course Schema
const courseSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    students:{
        type: Array,
    }
})

const courseModel = mongoose.model('courses', courseSchema);

module.exports = courseModel;