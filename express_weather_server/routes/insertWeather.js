/** insertWeather.js
 * Kyle Osbourne
 * Code inspired by https://www.npmjs.com/package/weather-js 
 * Project structure and code adapted from https://github.com/profjake/lecture15 
 */

const express = require('express');
const router = express.Router();
const http = require('http');
const mongoose = require('mongoose');
let dbManager = require('./dbManager');
const bodyParser = require('body-parser');

// Weather Information
// Weather-js Node Module used to retrieve weather information
let weather = require('weather-js');
const weatherCol = require('./models/weatherSchema.js');


// Render the insert Weather Page, redirect to login if the user is not logged in
router.get('/insertWeather', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insertWeather', {trusted: req.session.user});
	}
});

// POST Request for insertWeather done by Kyle Osbourne
router.post('/insertWeather', function(req, res,next) {
    const location = req.body.location;
    const favorite = req.body.favorite;
  
     /* This section displays the current weather for a user if a location is found
    if none is found,  a message stating that the location was not found will be displayed. */
    try {
    // NOTE: The API service was prone to timing out at random times.  Implemented a timeout of 15 seconds just in case it does.
    /* The weather.find function is derived from Fatih Cetinkaya's weather-js module, used to search for a location. */
      weather.find({ search: location, degreeType: 'F', timeout: 15000 }, function(err, result) {
        res.render('insertWeather', {
          location: location,
          favorite: favorite,
          results: result
        });
      });
    } catch (err) {
      console.log(err);
      res.render('insertWeather', {err});
    }
  });

module.exports = router;