/* File: app.js */

var tracker = require("tracker");
let dbManager = require('./dbManager');
let express = require("express");
let app = express();
var ObjectID = require('mongodb').ObjectId;
var userRouter = require('./routes/userRoutes.js')
app.set('views', '/views');
app.set('view engine', 'pug');

function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}
//mongoose return
function docifyActivity(params){
    let doc = new actCol({ activity: { type : params.activity.toString().toLowerCase() }, weight: params.weight,
		distance: params.distance, time: params.time, user: params.user});
    return doc;
}
function docifyUser(params){
    let doc = new userCol({_id: params.name, email: params.email, password: params.password });
    return doc;
}
app.set('views', './views');
app.set('view engine', 'pug');
app.use('/users', userRouter);
app.use(session({
	saveUninitialized: false,
	resave: false
}));
//get routes
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

//middleware functions
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
//post routes
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

// Weather-js Node Module
let weather = require('weather-js');

let http = require('http');
let qString = require('querystring');