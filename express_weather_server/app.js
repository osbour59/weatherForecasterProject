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
function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}

const userCol = require('./models/userSchema.js');
const plannerCol = require('./models/plannerSchema.js');
  app.use(session({
    secret: "terceS",
    saveUninitialized: false,
    resave: false
}));

/** Declare necessary routes for the app. */
const weatherRoutes = require('./routes/weatherRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js')
app.use('/', weatherRoutes);
app.use('/', loginRoutes);

// GET routes
app.get('/index', function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{

    	res.render('index', {trusted: req.session.user});
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

app.post('/updatePlanner', async (req, res) => {
    try {
        const userID = req.session.name;
        plannerID = userID + '_planner';
        const updatePlanner = await plannerCol.findByIdAndUpdate(plannerID, {entry: req.body});
        res.send("Planner Updated.");
    } catch(e) {

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
// POST routes


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

        const planner = await plannerCol.create({
            _id: `${req.body._id}_planner`
        });
        res.send("Successfully created account. <br><a href='/login'>Login</a>.")
    }
    catch(e) {
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

app.post('/changeEmail', async(req,res)=>{
    try{
        const newEmail = req.body.email;
        const userID = req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {email: newEmail});
        res.send("Email Address Updated.")
    }catch(e){
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

app.post('/changeAge', async(req,res)=>{
    try{
        const newAge= req.body.age;
        const userID= req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {age: newAge});
        res.send("Age Updated.")
    }catch(e){
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

app.post('/changeDisplayName', async(req,res)=> {
    try{
        const newName= req.body.displayName;
        const userID= req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {displayName: newName});
        res.send("Display Name Updated.")
    }catch(e) {
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

app.post('/changePassword', async(req,res)=>{
    try{
        const newPass = genHash(req.body.password);
        const userID= req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {password: newPass});
        res.send("Password Updated.")
    }catch(e){
        res.status(404).send(e.message);
        console.log(e.message);
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

