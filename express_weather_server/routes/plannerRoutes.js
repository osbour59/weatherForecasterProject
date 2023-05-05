/** 
 * plannerRoutes.js
 * 
 * Kyle Osbourne
 * 
 * Purpose: This file handles all routing requests related to the planner.
 * The planner entry value is passed through when the page renders, this is so the value can be plugged in
 * for the entry instead of having to type it again.
 * */
const express = require('express');
const router = express.Router();
const userCol = require('../models/userSchema.js');
const plannerCol = require('../models/plannerSchema.js');
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');

// GET Routes
/** GET Request to render the planner page */
router.get('/planner', async function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{
        const userID = req.session.user.name;
        try {
            /** The planner ID is formed so the planner entry field can be accessed immediately
             * This is so the user can update their planner AND is used for the Pug file to
             * auto-fill the planner with what they've already put.
             */
            const user = await userCol.findById(userID);
            const plannerID = userID + '_planner';
            const planner = await plannerCol.findById(plannerID);
            const darkMode = user.preferences.darkMode;
            res.render('planner', {trusted: req.session.user, darkMode, entry: planner.entry});
        } catch(e) {
            console.log(e.message);
        }
	}
});

// POST Routes
router.post('/planner', async (req, res) => {
    try {
        const userID = req.session.user.name;
        const plannerID = userID + '_planner';
        await plannerCol.findByIdAndUpdate(plannerID, {entry: req.body.entry});
        res.send("Planner updated.");
    } catch(e) {
        console.log(e);
        res.send("Error updating planner.");
    }
});


module.exports = router;
