/** 
 * settingsRoutes.js
 * 
 * Routing page by Kyle Osbourne with code from Brian Young
 * 
 * Code adapted from https://github.com/ProfJake/APWJS_Final_Lab/
 * Purpose: This page handles certain settings one user can change that will
 * reflect their account.
 * 
 * NOTE: The user cannot change their username, the reason for this was due
 * to how a user's saved locations and planner entry are handled within the application.
 */

const express = require('express');
const router = express.Router();
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');
let crypto = require('crypto');
const userCol = require('../models/userSchema');

function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}


/** GET Requests */

/** GET Request for the settings page.
 * This GET request renders the settings page.
 */
router.get('/settings', async function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{
        const userID = req.session.user.name;
        try {
            const user = await userCol.findById(userID);
            const darkMode = user.preferences.darkMode;
            res.render('settings', {trusted: req.session.user, darkMode});
        } catch(e) {
            console.log(e.message);
        }
	}
});

/** POST Requests */
/** changeEmail POST Request
 * The new email address is set to the appropriate variable,
 * the userID is accessed and then the user collection is
 * called to find the correct ID and update the email address.
 */
router.post('/changeEmail', async(req,res)=>{
    try{
        const newEmail = req.body.email;
        const userID = req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {email: newEmail});
        res.send("Email Address Updated. <br><a href='/settings'>Return to settings</a>"+
        ` or <br><a href='/'>Return to the homepage.</a>`);
    }catch(e){
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

/** changeDisplayName POST Request
 * The new display name is set to the appropriate variable, the user ID
 * is accessed using the needed query to update it, and the displayName
 * field is updated.
 */
router.post('/changeDisplayName', async(req,res)=> {
    try{
        const newName= req.body.displayName;
        const userID= req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {displayName: newName});
        res.send("Display Name Updated. <br><a href='/settings'>Return to settings</a>"+
        ` or <br><a href='/'>Return to the homepage.</a>`);
    }catch(e) {
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

/** changePassword POST Request
 * The new password is hashed using the genHash function.  The user ID is accessed
 * and set as a variable, this variable is accessed and updated with the new
 * hashed password.
 */
router.post('/changePassword', async(req,res)=>{
    try{
        const newPass = genHash(req.body.password);
        const userID= req.session.user.name;
        await userCol.findByIdAndUpdate(userID, {password: newPass});
        res.send("Password Updated. <br><a href='/settings'>Return to settings</a>"+
        ` or <br><a href='/'>Return to the homepage.</a>`);
    }catch(e){
        res.status(404).send(e.message);
        console.log(e.message);
    }
});

/** Dark Mode Toggle function done by Kyle Osbourne
 * The dark mode preference is actually a boolean in the user's preferences
 * subdocument.  With this post request, the boolean is accessed and changed
 * to true or false.  With this boolean, the webpages the user accesses will
 * check this preference and apply the appropriate CSS file.
 */
router.post('/toggleDarkMode', async(req,res) =>{
    const userID = req.session.user.name;
    try {
        const user = await userCol.findById(userID);
        user.preferences.darkMode = !user.preferences.darkMode;
        await user.save();
        res.redirect('/');
    } catch(e) {
        console.log(e.message);
        res.status(500).send('Unexpected error toggling dark mode.');
    }
});

module.exports = router;