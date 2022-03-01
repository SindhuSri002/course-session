//THIS FILE HAS ALL EXPRESS RELATED CODE

const express = require('express');
const morgan = require('morgan');
const AppError = require('./appError');
const globalErrorHandler = require('./controllers/errorController');
const courseRouter = require('./routers/courseRouter');
const sessionRouter = require('./routers/sessionRouter');

//started express app
const app = express();

//for development purpose -- it logs requests
app.use(morgan('dev'));


//It is used to access req.body
app.use(express.json());

//routes
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/sessions', sessionRouter);

//for handling unhandled errors
app.all('*',(req,res,next) => {
   
   next(new AppError(`Cant find ${req.originalUrl} on this server`,404));

});

//error handling middleware
//having 4 arguments express recognises it as error handler and uses it everytime we have an error
app.use(globalErrorHandler);

module.exports = app;