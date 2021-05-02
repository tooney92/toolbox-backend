if(process.env.NODE_ENV !== 'production'){
    // require("dotenv").config({path: __dirname + '/.env'})
    require("dotenv").config();
}
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes');
const winston = require('./util/winston');
const config = require('better-config');
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload");
const { reject } = require("lodash");
const { resolve } = require("app-root-path");
// config.set('../config.json');

config.set('./config.json');

//cors handling..................
app.use(cors())

//parse req with express
app.use(express.json())

//file upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
    abortOnLimit: true
}))

//log with morgan
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.urlencoded({extended: true}))
app.use('/api', routes)



//mongoDB connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: false, useFindAndModify: false})
const db = mongoose.connection

db.on("open", ()=>{
    console.log("mongodb connected");
})

db.on('error', err => {
    console.error('connection error:', err)
})

const port = process.env.PORT || config.get('application.port');
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})
