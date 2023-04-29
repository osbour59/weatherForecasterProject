/* File: app.js 
Kyle Osbourne & Anthony Adass */

/* Code inspired by https://www.npmjs.com/package/weather-js 
Project structure and code adapted from https://github.com/profjake/lecture15 */

// Weather Information
// Weather-js Node Module used to retrieve weather information
const weatherFind = require('weather-js');
const weatherAdd = require('weather-js');
const weatherCol = require('./models/weatherSchema.js');

let http = require('http');
let qString = require('querystring');

let dbManager = require('./dbManager');
let express = require("express");
let app = express();
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId

const mongoose = require('mongoose');
mongoose.set('bufferCommands', true);

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));


// Login Information
let session = require('express-session');
let crypto = require('crypto');
const userCol = require('./models/userSchema.js');
function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}

  app.use(session({
    secret: "terceS",
    saveUninitialized: false,
    resave: false
}));

// GET routes
app.get('/index', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('index', {trusted: req.session.user});
	}

});
app.get('/login', function(req, res, next){
    if (req.session.user){
        res.redirect('/index');
    }else{
        res.render('login');
    }
});

// Render the insert Weather Page, redirect to login if the user is not logged in
app.get('/insertWeather', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insertWeather', {trusted: req.session.user});
	}
});

// Render the Sign-up Page
app.get('/createUser', function(req, res){
    if(!req.session.user){
        res.render('createUser', {trusted: req.session.user});
    }
    else{
        res.redirect('index');
    }
});

// GET Request for insertWeather done by Kyle Osbourne
app.get('/insertWeather', function(req, res) {
	res.render('insertWeather');
  });

  app.get('/savedLocations', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('savedLocations', {trusted: req.session.user});
	}
});

app.get('/settings', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('settings', {trusted: req.session.user});
	}
});

app.get('/planner', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('planner', {trusted: req.session.user});
	}
});


// Middleware Functions
app.get('/', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('index', {trusted: req.session.user});
	}

});
app.use(function(req, res, next){
    let now = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
    console.log(`${req.method} Request to ${req.path} Route Received: ${now}`);
    next();
});

app.get('/login', function(req, res, next){
    if (req.session.user){
        res.redirect('index');
    }else{
        res.render('/login');
    }
});
app.get('/insertWeather', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insertWeather', {trusted: req.session.user});
	}
});



// POST routes
app.post('/login', express.urlencoded({extended:false}), async (req, res, next)=>{
	let untrusted= {user: req.body.userName, password: genHash(req.body.pass)};
	console.log(untrusted.password)
	try{

		let result = await userCol.findOne({_id: req.body.userName});

		if (untrusted.password.toString().toUpperCase()==result.password.toString().toUpperCase()){
			let trusted={name: result._id.toString()};
            req.session.user = trusted;
			res.redirect('/');
            console.log("Successful Login Detected.");
		} else{
			res.redirect('/login');
            console.log("Unsuccessful Login Detected.");	
		}
	} catch (err){
		next(err)	
        console.log(err);
	}
});


/* Post Request for createUser
Code adapted from https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0 */
app.post('/createUser', async (req, res) => {
    try {
        const hashedPassword = genHash(req.body.password);
        const user = await userCol.create({
            _id:req.body._id,
            displayName:req.body.displayName,
            age:req.body.age,
            email:req.body.email,
            password:hashedPassword
        });
        res.send("Successfully created account.")
    }
    catch(e) {
        res.status(404).send(e.message)
        console.log(e.message);
    }
});


// POST Request for insertWeather done by Kyle Osbourne
app.post('/insertWeather', function(req, res,next) {
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
app.post('/addLocation', async (req, res) => {
    const userID = req.session.user.name;
    const location = req.body.location;
    console.log(`${userID} Request to add location ${location}`);
    
    try {
        weatherAdd.find({ search: location, degreeType: 'F', timeout: 15000 }, function(err, result) {
            const weather = weatherCol.create({
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

      res.send(`Successfully added location: ${location}.`);

    } catch (err) {
      console.log(err);
      res.status(500).send("Unexpected Error!!");
    }
  });
  


 /* Starts the ExpressJS server on Port 6900 */
app.listen(6900, async ()=> {
    try{
		await mongoose.connect('mongodb://127.0.0.1:27017/weatherDB', {useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e){
        console.log(e.message);
    }

    console.log("Server running on port 6900");
});

