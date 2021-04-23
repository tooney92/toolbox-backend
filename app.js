const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes');
const winston = require('./util/winston');
const config = require('better-config');
// config.set('../config.json');

config.set('./config.json');

//parse req with express
app.use(express.json())

//log with morgan
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.urlencoded({extended: true}))
app.use('/api', routes)


const port = process.env.PORT || config.get('application.port');
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})
