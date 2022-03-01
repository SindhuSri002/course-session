const AppError = require('../appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message,400);
}

const handleDuplcateFieldsDB = (err) => {
    const val = Object.keys(err.keyValue).map(el=> err.keyValue[el]);
    const message = `Provided duplicate value ${val.join('. ')} . enter another one`;
    return new AppError(message,400);
}

const handleValidationDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input . ${errors.join('. ')}`;
    return new AppError(message,400);
}

const errorDev = (err,res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack:err.stack
    });
}

const errorProd = (err,res) =>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else{
        console.log("error",err);
        res.status(500).json({
            status:"fail",
            message:"something went wrong",
        });
    }
}

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV==='development'){
        errorDev(err,res);
    }else if(process.env.NODE_ENV==='production'){
        let error = { ...err };

        //console.log(error);

        if(error.name==="CastError") error = handleCastErrorDB(error);
        if(error.code===11000) error = handleDuplcateFieldsDB(error); //MongoError

        const errname = error._message;
        //console.log(errname);
        if(errname === "User validation failed") error = handleValidationDB(error);

        errorProd(error,res);
    }
};