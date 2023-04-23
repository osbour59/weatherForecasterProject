/* File: app.js */

// Weather-js Node Module
let weather = require('weather-js');

let http = require('http');
let qString = require('querystring');

let dbManager = require('./dbManager');
let express = require("express");
let app = express();
const bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectId;

var userRouter = require('./routes/userRoutes.js')
app.set('views', '/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use(session({
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
app.get('/insert', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insert', {trusted: req.session.user});
	}
});

// GET Request for insertWeather done by Kyle Osbourne
app.get('/insertWeather', function(req, res) {
	res.render('insertWeather');
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
app.get('/insert', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insert', {trusted: req.session.user});
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
		} else{
			res.redirect('/login');
		}
	} catch (err){
		next(err)		
	}
})

// POST Request for insertWeather done by Kyle Osbourne
app.post('/insertWeather', async (req, res) => {
    let location = req.body.location;
    let favorite = req.body.favorite;
  
    try {
    // NOTE: The API service is prone to timing out.  Implemented a timeout of 15 seconds.
      let result = await weather.find({ search: location, degreeType: 'F', timeout: 15000 });
      res.render('insertWeather', {
        location: location,
        favorite: favorite,
        results: result,
      });
    } catch (err) {
      console.log(err);
      res.render('insertWeather', { locationNotFound: true });
    }
  });

  //Express listen function is literally the HTTP server listen method
//so we can do the exact same things with it as before
app.listen(6900, async ()=> {
    //start and wait for the DB connection
    try{
        await dbManager.get("weatherDB");
    } catch (e){
        console.log(e.message);
    }
    console.log("Server running on Port 6900");
});

