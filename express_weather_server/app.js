/* File: app.js 
Kyle Osbourne & Anthony Adass */

/* Code inspired by https://www.npmjs.com/package/weather-js 
Project structure and code adapted from https://github.com/profjake/lecture15 */

let http = require('http');
let qString = require('querystring');

let dbManager = require('./dbManager');
let express = require("express");
let app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId

const mongoose = require('mongoose');
mongoose.set('bufferCommands', true);

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));


// Login Information
let session = require('express-session');

const userCol = require('./models/userSchema.js');
  app.use(session({
    secret: "terceS",
    saveUninitialized: false,
    resave: false
}));

/** The planner collection is called here because it needs
 * to be accessed so the user's current planner can display
 * on the index.
 */
const plannerCol = require('./models/plannerSchema.js');

/** Declare necessary routes for the app to function properly. */
const weatherRoutes = require('./routes/weatherRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');
const settingsRoutes = require('./routes/settingsRoutes.js');
const plannerRoutes = require('./routes/plannerRoutes.js');
const createUserRoutes = require('./routes/createUserRoutes.js');
app.use('/', weatherRoutes);
app.use('/', loginRoutes);
app.use('/', settingsRoutes);
app.use('/', plannerRoutes);
app.use('/', createUserRoutes);


// GET routes
app.get('/index', async function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{
        const userID = req.session.user.name;
        try {
            /** Retrieve the userID to pass to the index page
             * to display the user's display name, favorite
             * locations, and whether or not to load
             * dark mode.
             */
    		const user = await userCol.findById(userID);
            const displayName = user.displayName;
			const favoriteLocations = user.favoriteLocations;
            const darkMode = user.preferences.darkMode;
            /** Retrieve the plannerID to pass to the index page to
             * display the entry to the user.
             */
            const plannerID = userID + "_planner";
            const planner = await plannerCol.findById(plannerID);
            const entry = planner.entry;
			res.render('index', {trusted: req.session.user, favoriteLocations, displayName, entry, darkMode});
    	} catch(e) {
            console.log(e.message);
        }
	}

});

// Middleware Functions
/** Dark Mode Middleware by Kyle Osbourne
 * This static express file was needed to serve the stylesheet to the user.
 * https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type
 * https://expressjs.com/en/starter/static-files.html
 */
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

app.get('/', async function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{
        const userID = req.session.user.name;
        try {
            /** Retrieve the userID to pass to the index page
             * to display the user's display name, favorite
             * locations, and whether or not to load
             * dark mode.
             */
    		const user = await userCol.findById(userID);
            const displayName = user.displayName;
			const favoriteLocations = user.favoriteLocations;
            const darkMode = user.preferences.darkMode;
            /** Retrieve the plannerID to pass to the index page to
             * display the entry to the user.
             */
            const plannerID = userID + "_planner";
            const planner = await plannerCol.findById(plannerID);
            const entry = planner.entry;
			res.render('index', {trusted: req.session.user, favoriteLocations, displayName, entry, darkMode});
    	} catch(e) {
            console.log(e.message);
        }
	}

});


app.use(function(req, res, next){
    let now = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
    console.log(`${req.method} Request to ${req.path} Route Received: ${now}`);
    next();
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

