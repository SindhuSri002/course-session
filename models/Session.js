const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,"session must have a title"],
    },
    agenda:{
        type: String,
        required: [true,"session must have a agenda"]
    },
    startTime:{
        type: String,
        required: [true,"session must have a startTime"]
    },
    endTime:{
        type: String,
        required: [true,"session must have a endTime"]
    },
    link:{
        type: String,
        required: [true,"session must have a link"]
    },
    forCourse:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:[true,"Session must belong to a course"]
    }
},
{
    //to make object data visible in json or text format
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

sessionSchema.pre(/^find/,function(next){
    this.populate({
        path:"forCourse",
        select:"name"
    });
    next();
});

const Session = mongoose.model('Session',sessionSchema);

module.exports = Session;
