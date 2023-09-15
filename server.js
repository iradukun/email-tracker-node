'use strict';
require('./loadEnv');
const express = require('express');
const app = express();
const logger = require('./config/logger');
const routes = require('./app/route');

// const Promise = require('bluebird');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static('./public'));

// start: set up db
mongoose.Promise= global.Promise;
const connectToDatabase = async ()=> {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  };
  
  connectToDatabase();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// log routes
app.use(function(req, res, next){
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});
app.use('/', routes);

app.listen(process.env.PORT, () => logger.info('server started'));
process.on('uncaughtException', function(err) {
    logger.error('error', err);
});
