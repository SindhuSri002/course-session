//THIS FILE HAS ALL SERVER AND DATABASE RELATED CODE

const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
const app = require('./app');

//uncaught exception
process.on('uncaughtException',err => {
    console.log(err.name,err.message);
    console.log("UncaughtException");
    process.exit(1);
});

//To let know server.js that there are environment variables in config.env
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
}).then(() => console.log("connected to DB"));

const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{
    console.log(`listening on ${port}`);
});

//handling global unhandled promises
process.on('unhandledRejection',err => {
    console.log(err.name,err.message);
    console.log("UNHANDLED REJECTION");
    server.close(() => {
        process.exit(1);
    });
});