const catchAsync = require('../utils/catchAsync');
const AppError = require('../appError');
const Course = require('../models/Course');

exports.addCourse = catchAsync(async (req,res,next)=>{
    const {name,description,coach} = req.body;
    const newCourse = await Course.create({name,description,coach});
    //console.log(typeof(newCourse.id));
    res.status(201).json({
        status: "success",
        data: newCourse
    });
});

exports.getAllCourses = catchAsync(async (req,res,next) => {
    const courses = await Course.find().populate("sessions");
    res.status(200).json({
        status: "success",
        courses
    });
});

exports.getCourse = catchAsync(async (req,res,next) => {
    //console.log(req.params);
    const param = req.params["name"];
    //console.log(param);
    const queryArr = param.split("-");
    const query = queryArr.join(" ");
    //console.log(query);
    const course = await Course.findOne({name:query}).populate("sessions");
    if(!course){
        return next(new AppError("No course found",404));
    }
    res.status(200).json({
        status: "success",
        course
    });
});

exports.updateCourse = catchAsync(async (req,res,next) => {
    const param = req.params["name"];
    const queryArr = param.split("-");
    const query = queryArr.join(" ");
    //console.log(req.body);
    const course = await Course.findOneAndUpdate({name:query},req.body,{upsert:false});
    if(!course){
        return next(new AppError("course not found to be updated",400));
    }
    res.status(200).json({
        status: "success",
        course
    });
});

exports.deleteCourse = catchAsync(async (req,res,next) => {
    const name = req.params["name"];
    const course = await Course.findOneAndDelete({name:name});
    if(!course){
        return next(new AppError("course is not found",400));
    }
    res.status(200).json({
        status:"success",
        course
    });
});