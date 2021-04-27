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
// config.set('../config.json');

config.set('./config.json');

//cors handling..................
app.use(cors())

//parse req with express
app.use(express.json())

//log with morgan
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.urlencoded({extended: true}))
app.use('/api', routes)

//mongoDB connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
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
