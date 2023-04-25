/* File: app.js 
Kyle Osbourne & Anthony Adass */

// Weather-js Node Module
let weather = require('weather-js');

let http = require('http');
let qString = require('querystring');

let dbManager = require('./dbManager');
let express = require("express");
let app = express();
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId

var userRouter = require('./routes/userRoutes.js')
let mongoose = require('mongoose');
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());



// Login Information
let session = require('express-session');
let crypto = require('crypto');
const userCol = require('./models/userSchema');
function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}

app.use('/users', userRouter);
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

app.get('/createUser', function(req, res){
    res.render('createUser');
});

app.get('/insertWeather', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('insertWeather', {trusted: req.session.user});
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
/* app.get('/', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('index', {trusted: req.session.user});
	}

});*/
app.use(function(req, res, next){
    let now = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
    console.log(`${req.method} Request to ${req.path} Route Received: ${now}`);
    next();
});

/*app.get('/login', function(req, res, next){
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
}); */



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

/*app.post('/addLocation', async (req, res) => {

}); */


 
app.listen(6900, async ()=> {
    try{
		await mongoose.connect('mongodb://localhost:27017/practiceDB', {useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e){
        console.log(e.message);
    }

    console.log("Server running on port 6900");
});

