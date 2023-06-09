/** createUserRoutes.js
 * Code by Kyle Osbourne & Anthony Adass
 * Purpose: This routing file handles all GET/POST requests necessary
 * for creating a new user.
 * Code adapted from https://github.com/ProfJake/APWJS_Final_Lab/
 */

const express = require('express');
const router = express.Router();
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');
let crypto = require('crypto');
const userCol = require('../models/userSchema');
const plannerCol = require('../models/plannerSchema.js');


function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}

// GET Routes by Brian Young

// Render the Sign-up Page
router.get('/createUser', function(req, res){
    if(!req.session.user){
        res.render('createUser', {trusted: req.session.user});
    }
    else{
        res.redirect('index');
    }
});

/* Post Request for createUser done by Kyle Osbourne & Anthony Adass
Code adapted from https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0 */
router.post('/createUser', async (req, res) => {
    try {
        const hashedPassword = genHash(req.body.password);
        /** The password is hashed before being stored into the database to 
         * ensure it's stored in a secure manner, also for validation at login.
         */
        const user = await userCol.create({
            _id:req.body._id,
            displayName:req.body.displayName,
            email:req.body.email,
            password:hashedPassword
        });
        /** The user's personal planner is also created here.  It's ID is determined
         * by the user's username for access later.
         */
        const planner = await plannerCol.create({
            _id: `${req.body._id}_planner`,
            entry: ""
        });
        res.send("Successfully created account. <br><a href='/login'>Login</a>.")
    }
    catch(e) {
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

module.exports = router;