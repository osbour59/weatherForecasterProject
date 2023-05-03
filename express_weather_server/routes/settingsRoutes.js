/** settingsRoutes.js
 * Routing page by Kyle Osbourne with code from Brian Young
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

router.post('/changeEmail', async(req,res)=>{
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

router.post('/changeAge', async(req,res)=>{
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

router.post('/changeDisplayName', async(req,res)=> {
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

router.post('/changePassword', async(req,res)=>{
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