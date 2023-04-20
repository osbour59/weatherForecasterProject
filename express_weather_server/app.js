/* File: app.js */
var tracker = require("tracker");
let dbManager = require('./dbManager');
let express = require("express");
let app = express();
var ObjectID = require('mongodb').ObjectId;
var userRouter = require('./routes/userRoutes.js')
app.set('views', '/views');
app.set('view engine', 'pug');