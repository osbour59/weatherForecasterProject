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

/** Declare necessary routes for the app. */
const weatherRoutes = require('./routes/weatherRoutes.js');
app.use('/', weatherRoutes);

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

// Render the Sign-up Page
app.get('/createUser', function(req, res){
    if(!req.session.user){
        res.render('createUser', {trusted: req.session.user});
    }
    else{
        res.redirect('index');
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


/* Post Request for createUser done by Kyle Osbourne & Anthony Adass
Code adapted from https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0 */
app.post('/createUser', async (req, res) => {
    try {
        const hashedPassword = genHash(req.body.password);
        /** The password is hashed before being stored into the database to 
         * ensure it's stored in a secure manner, also for validation at login.
         */
        const user = await userCol.create({
            _id:req.body._id,
            displayName:req.body.displayName,
            age:req.body.age,
            email:req.body.email,
            password:hashedPassword
        });
        res.send("Successfully created account. <br><a href='/login'>Login</a>.")
    }
    catch(e) {
        res.status(404).send(e.message)
        console.log(e.message);
    }
});


  //Logs the user out of the program, Anthony Adass
  app.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.send(`Logout successful <br><a href='/login'>Return to the Login Page.</a>`)
        }
      });
    } else {
      res.end()
    }
  })


 /* Starts the ExpressJS server on Port 6900 */
app.listen(6900, async ()=> {
    try{
		await mongoose.connect('mongodb://127.0.0.1:27017/weatherDB', {useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e){
        console.log(e.message);
    }

    console.log("Server running on port 6900");
});

