/* File: app.js 
Kyle Osbourne & Anthony Adass */

/* Code inspired by https://www.npmjs.com/package/weather-js 
Project structure and code adapted from https://github.com/profjake/lecture15 */

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

app.use('/insertWeather', require("./routes/insertWather"));


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
        res.redirect('/index');
    }else{
        res.render('login');
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

app.get('/addLocation', function(req, res, next){
    if (req.session.user){
        res.redirect('index');
    }else{
        res.render('/addLocation');
    }
});


// POST routes
app.post('/login', express.urlencoded({extended:false}), async (req, res, next)=>{
	let untrusted= {user: req.body.userName, password: genHash(req.body.pass)};
	console.log(untrusted.password)
	try{

		let result = await userCol.findOne({_id: req.body.userName});
        /* The result of the login attempt is sent to console.  If successful, it returns
        succesful, and vice versa. */
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


/* Post Request for createUser by Kyle Osbourne & Anthony Adass
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
            /* When creating an account, the password needs to be hashed to allow for proper validation
            when logging in. */
        });
        res.send("Successfully created account.")
    }
    catch(e) {
        res.status(404).send(e.message)
        console.log(e.message);
    }
});
  
/* This is where the location is actually added into the database.
The location variable is passed through the /insertWeather post request using the Pug form request.
The user id (username), is pulled from the session information.
This is needed to add the information into the database. */
app.post('/addLocation', async (req, res) => {
    const userID = req.session.user.name;
    const location = req.body.location;
    /* The add request is sent to console. */
    console.log(`${userID} Request to add location ${req.body.location}`);

    console.log('${current.observationtime}');
    /* Add the weather location to the database. */

   /** const weather = await weatherCol.create({
        _id:userID,
        

    }); */

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

