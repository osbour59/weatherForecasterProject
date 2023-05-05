/**
 * app.js 
 * Kyle Osbourne & Anthony Adass
 * Purpose: This file handles the procedures necessary to start the server.  All the necessary
 * routes and middleware are declared here so the user can access them without needing the code here.
 */

/* Code inspired by https://www.npmjs.com/package/weather-js 
Project structure and code adapted from https://github.com/profjake/lecture15 
and https://github.com/ProfJake/APWJS_Final_Lab/ */

let http = require('http');
let qString = require('querystring');

let dbManager = require('./dbManager');
let express = require("express");
let app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId

const mongoose = require('mongoose');
mongoose.set('bufferCommands', true);

/** Set up the Pug templating engine. */
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));


// Login Information
/** This is used to establish a user's session while they're logged in.  If they are logged out, they will
 * be unable to access most pages except for login and signup.
 */
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

/** Render the index page.  The user's planner
 * is also loaded here so it displays on the page.
 */
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

 /* Starts the ExpressJS server on Port 6900 */
app.listen(6900, async ()=> {
    try{
		await mongoose.connect('mongodb://127.0.0.1:27017/weatherDB', {useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e){
        console.log(e.message);
    }

    console.log("Server running on port 6900");
});

