/* File: app.js */

app.set('views', '/views');
app.set('view engine', 'pug');

// Weather-js Node Module
let weather = require('weather-js');

let http = require('http');
let qString = require('querystring');