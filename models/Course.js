const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"course must have a name"],
        unique: true
    },
    description:{
        type: String,
        required: [true,"course must have a description"],
    },
    coach:{
        type: String,
        required: [true,"course must have a coach"]
    },
},
{
    //to make object data visible in json or text format
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

courseSchema.virtual("sessions",{
    ref:"Session",
    foreignField:"forCourse",
    localField: "_id"
});

const Course = mongoose.model("Course",courseSchema,"Course");

module.exports = Course;
