const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./scripts');
// config.set('../config.json');

app.use(express.json())
app.use(express.urlencoded())

console.log(process.env);