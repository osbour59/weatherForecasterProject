/* File: app.js 
Kyle Osbourne & Anthony Adass */

/* Code inspired by https://www.npmjs.com/package/weather-js 
Project structure and code inspired by https://github.com/profjake/lecture15 */

// Weather-js Node Module used to retrieve weather information
let weather = require('weather-js');

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
// app.use(cookieParser());



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
app.get('/', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('index', {trusted: req.session.user});
	}

});
app.get('/login', function(req, res, next){
    if (req.session.user){
        res.redirect('/');
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
        res.redirect('/');
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
        res.redirect('/');
    }else{
        res.render('login');
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
		let result = await userCol.findOne({_id: req.body._id});
		if (untrusted.password.toString().toUpperCase()==result.password.toString().toUpperCase()){
			let trusted={name: result.userName.toString()};
            req.session.user = trusted;
			res.redirect('/');
		} else{
			res.redirect('/login');
		}
	} catch (err){
		next(err)		
	}
});


/* Post Request for createUser
Code adapted from https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0
Note: This is currently unstable, returns null when trying to login. */
app.post('/createUser', async (req, res) => {
    try {
        const newUser = await userCol.create({
            _id:req.body._id,
            displayName:req.body.displayName,
            age:req.body.age,
            email:req.body.email,
            password:req.body.password
        });
        res.send("Successfully created account.")
    }
    catch(e) {
        res.status(404).send(e.message)
        console.log(e.message);
    }
});


// POST Request for insertWeather done by Kyle Osbourne
app.post('/insertWeather', async (req, res) => {
    let location = req.body.location;
    let favorite = req.body.favorite;
  /* This section displays the current weather for a user if a location is found
if none is found,  a message stating that the location was not found will be displayed. */
    try {
    // NOTE: The API service was prone to timing out at random times.  Implemented a timeout of 15 seconds just in case it does.
    /* The weather.find function is derived from Fatih Cetinkaya's weather-js module, used to search for a location. */
      let result = await weather.find({ search: location, degreeType: 'F', timeout: 15000 });
      res.render('insertWeather', {
        location: location,
        favorite: favorite,
        results: result,
      });
    } catch (err) {
      console.log(err);
      res.render('insertWeather', { 
        locationNotFound: true
     });
    }
  });

/*app.post('/addLocation', async (req, res) => {

}); */

 /* Starts the ExpressJS server on Port 6900 */
app.listen(6900, async ()=> {
    try{
		await mongoose.connect('mongodb://127.0.0.1:27017/weatherDB', {useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e){
        console.log(e.message);
    }

    console.log("Server running on port 6900");
});

