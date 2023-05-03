/** 
 * plannerRoutes.js
 * Kyle Osbourne
 * Purpose: This file handles all routing requests related to the planner.
 * */
const express = require('express');
const router = express.Router();
const userCol = require('../models/userSchema.js');
const plannerCol = require('../models/plannerSchema.js');
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');

// GET Routes
router.get('/planner', async function (req, res){
	if (!req.session.user){
        res.redirect('/login');
    }
    else{
        const userID = req.session.user.name;
        try {
            const user = await userCol.findById(userID);
            const darkMode = user.preferences.darkMode;
            res.render('planner', {trusted: req.session.user, darkMode});
            const plannerEntries = await plannerCol.find();
            console.log(plannerEntries);
        } catch(e) {
            console.log(e.message);
        }
	}
});

// POST Routes
router.post('/updatePlanner', async (req, res) => {
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
