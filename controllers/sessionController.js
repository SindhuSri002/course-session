const catchAsync = require('../utils/catchAsync');
const AppError = require('../appError');
const Session = require('../models/Session');
const Course = require('../models/Course');

exports.addSession = catchAsync(async (req, res, next) =>{
    if(!req.body.forCourse) req.body.forCourse = req.params["id"];
    const {title,agenda,startTime,endTime,link,forCourse} = req.body;
    // console.log(req.body);
    //console.log(forCourse);
    const verify = await getSessions(forCourse,startTime,endTime);
    //console.log(verify);
    if(!verify){
        return next(new AppError("sessions must not overlap",400));
    }
    const newSession = await Session.create( {title,agenda,startTime,endTime,link,forCourse});

    res.status(201).json({
        status: "success",
        data: newSession
    });
});

const getSessions = async (id,st,et)=>{
    const sessions = await Session.find({forCourse:id});
    for(let obj of sessions){
        if((obj.startTime<=st&&obj.endTime>=et)||(obj.startTime<=st&&obj.endTime>=st)||(obj.startTime>=st&&obj.startTime<=et)){
            // console.log(obj.startTime);
            // console.log(obj.endTime);
            return false;
        }
    }
    return true;
};

// exports.getAllSessions = catchAsync(async (req,res,next)=>{
//     const sessions = await Session.find({});

//     if(!sessions){
//         return next(new AppError("No sessions found",404));
//     }

//     res.status(200).json({
//         status:"success",
//         sessions
//     });
// });

exports.getAllSessionsOfACourse = catchAsync(async (req,res,next)=>{

    let filter = {};
    if(req.params.id) filter = {forCourse : req.params.id}

    const sessions = await Session.find(filter);

    if(!sessions){
        return next(new AppError("No sessions found",404));
    }

    res.status(200).json({
        status:"success",
        sessions
    });
});

exports.updateSession = catchAsync(async (req,res,next) => {
    if(!req.body.forCourse) req.body.forCourse = req.params["id"];
    const id = req.params["sessionId"];
    const session = await Session.findOneAndUpdate({_id:id},req.body,{upsert:false});
    if(!session){
        return next(new AppError("Session is not found",400));
    }
    res.status(200).json({
        status:"success",
        session
    });
});

exports.deleteSession = catchAsync(async (req,res,next) => {
    const id = req.params["sessionId"];
    const session = await Session.findOneAndDelete({_id:id});
    if(!session){
        return next(new AppError("Session is not found",400));
    }
    res.status(200).json({
        status:"success",
        message:"deleted successfully"
    });
});