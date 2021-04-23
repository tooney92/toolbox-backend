const appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('better-config');

config.set('../config.json');


// const logger = winston.createLogger({
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.DailyRotateFile({ filename:  `${appRoot}/logs/error.log`, level: 'error', datePattern: 'DD-MM-YYYY'}),
//         new winston.transports.File({ filename:  `${appRoot}/logs/app.log`, level: 'info', datePattern: 'DD-MM-YYYY'}),
//     ],
// });

const transportAppLogs = new winston.transports.DailyRotateFile({
    filename: `${appRoot}/logs/appLog-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

const transportErrLogs = new winston.transports.DailyRotateFile({
    filename: `${appRoot}/logs/errorLogs-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error'
  });

  var logger = winston.createLogger({
    transports: [
        transportAppLogs, 
        transportErrLogs
    ]
  });

logger.stream = {
    write: (message, encoding) => {
      logger.info(message);
    },
};

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
module.exports = logger;
// console.log(`${appRoot}/logs/app.log`);