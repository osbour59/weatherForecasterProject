/** weatherRoutes.js
 * Kyle Osbourne
 * Purpose: This routing file handles all weather related router requests, including seeking locations and parsing
 * data into the database.  This file requires the weather-js dependency from Node Package Manager
 * Code adapted from https://github.com/ProfJake/APWJS_Final_Lab/
 * Weather related code adapted and inspired from https://www.npmjs.com/package/weather-js
 */
const express = require('express');
const router = express.Router();
const weatherFind = require('weather-js');
const weatherAdd = require('weather-js');
const weatherCol = require('../models/weatherSchema.js');
const userCol = require('../models/userSchema.js');
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');


/** GET Requests */
// GET Request for insertWeather done by Kyle Osbourne
// Render the insert Weather Page, redirect to login if the user is not logged in
router.get('/insertWeather', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insertWeather', {trusted: req.session.user});
	}
});

router.get('/savedLocations', async function(req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else {
    try {
      const userID = req.session.user.name;
      /** For lookup with the query, the userID is specificed using regex so only their saved locations show up.
        * Documentation: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
        * This is also mentioned in the post request for addLocation.
        */
      const savedLocations = await weatherCol.find({ _id: { $regex: `^${userID}_` } });
      res.render('savedLocations', {trusted: req.session.user, locations: savedLocations});
    } catch (err) {
      console.log(err);
      res.status(404).send("Unexpected Error!!");
    }
  }
});

/** POST Requests */
// POST Request for insertWeather done by Kyle Osbourne
router.post('/insertWeather', function(req, res,next) {
    const location = req.body.location;
    const favorite = req.body.favorite;
  
     /* This section displays the current weather for a user if a location is found
    if none is found,  a message stating that the location was not found will be displayed. */
    try {
    // NOTE: The API service was prone to timing out at random times.  Implemented a timeout of 15 seconds just in case it does.
    /* The weather.find function is derived from Fatih Cetinkaya's weather-js module, used to search for a location. */
      weatherFind.find({ search: location, degreeType: 'F', timeout: 15000 }, function(err, result) {
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

/** Add Location POST request done by Kyle Osbourne */
/* This is where the location is actually added into the database.
The location variable is passed through the /insertWeather post request using the Pug form request.
The user id (username), is pulled from the session information.
This is needed to add the information into the database. */
router.post('/addLocation', async (req, res) => {
    const userID = req.session.user.name;
    const location = req.body.location;
    console.log(`${userID} Request to add location ${location}`);
    
    try {
        /** This variable is used to check if the location is already stored into the database.
         * If it exists, block the request, if not, let it proceed.
         */
        const duplicateLocation = await weatherCol.findOne({_id: `${userID}_${req.body.location}` });
        if (duplicateLocation) {
          console.log(`${userID} Request to add location ${location} BLOCKED.`);
            res.send(`Location ${location} is already saved in your account.<br><a href='/insertWeather'>Insert a different location</a>` +
            ` or <br><a href='/'>Return to the homepage.</a>`);
        } else {
        weatherAdd.find({ search: location, degreeType: 'F', timeout: 15000 }, async function(err, result) {

            const weather = await weatherCol.create({
                /** The user's userID and result name are combined to prevent duplication issues with Mongoose.  
                 * For lookup, this will be spliced to only search under the user's ID. This
                 * will also allow for the user to have their personalized locations when they login.
                 * The way the variables are spliced allows saved locations to be looked up with REGEX 
                 * and the userID.
                 * Documentation: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
                */
                _id: `${userID}_${req.body.location}`,
                location: {
                  name: result[0].location.name,
                  latitude: result[0].location.lat,
                  longitude: result[0].location.long,
                  timezone: result[0].location.timezone,
                  degreeType: result[0].location.degreetype
                },
                /** The map function was used to populate the data model
                 * with the needed forecast for 5 days.
                 * Sources: https://www.w3schools.com/jsref/jsref_map.asp
                 * Modern JavaScript for the Impatient - Chapter 3
                 */
                forecast: result[0].forecast.map(forecast => ({
                  lowTemperature: forecast.low,
                  highTemperature: forecast.high,
                  skyCode: forecast.skycodeday,
                  skyText: forecast.skytextday,
                  date: forecast.date,
                  day: forecast.shortday,
                  precipitation: forecast.precip
                }))
              });

          });

      res.send(`Successfully added location: ${location}. <br><a href='/insertWeather'>Insert a different location</a>` +
      ` or <br><a href='/'>Return to the homepage.</a>`);
          
    }} catch (err) {
      console.log(err);
      res.status(500).send("Unexpected Error!!");
    }
  });

  /** POST request for savedLocations done by Kyle Osbourne
 * This is used to display information relating to what location the user selected in the dropdown menu.
 */
router.post('/savedLocations', async (req, res) => {
    const userID = req.session.user.name;
    const locationID = req.body.location;
    console.log(`${userID} Request for weather at location ID ${locationID}`);
  
    try {
      const weather = await weatherCol.findById(locationID);
      res.render('forecast', {weather});
    } catch (err) {
      console.log(err);
      res.status(500).send("Unexpected Error!!");
    }
  });
  
  /** POST Request to Delete a location done by Kyle Osbourne
   * The user and location IDs are formed, and a query
   * to find the specific location to the user is performed
   * to delete the location from their page.
   */
  router.post('/deleteLocation', async (req, res) => {
    try {
      const userID = req.session.user.name;
      const location = req.body.location
      const locationID = userID + "_" + location;
      console.log(`${userID} Request to DELETE location ID ${locationID}`);
      await weatherCol.findByIdAndDelete(locationID);
      res.send(`Location deleted successfully <br><a href='/insertWeather'>Insert a different location</a>` +
      ` or <br><a href='/'>Return to the homepage.</a>`);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });  

  module.exports = router;
  
  