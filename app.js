/**
 * Filename: app.js
 * Author: Kevin Coetzee
 * 
 *  The app.js file is used for routing to different 
 * `platforms' cleaner APIs
 */

const express = require('express');
const session = require('express-session');
const app = express();

const trieRoute = require('./dataStructures/trie');
const navigationRoute = require('./navigation');

app.use(session({secret:'supersecret', saveUninitialized: false, resave: false}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "*"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
  });

app.use('/', navigationRoute);

app.use('/trie', trieRoute);

app.use((req, res, next) => {
    const error = new Error("Resource not found");
    error.status = 404;
    next(error);
  });

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        status: error.status,
        message: error.message
      }
    });
  });

module.exports = app;