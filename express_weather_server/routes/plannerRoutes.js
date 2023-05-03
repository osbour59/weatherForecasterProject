/** 
 * plannerRoutes.js
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
        } catch(e) {
            console.log(e.message);
        }
	}
});

// POST Routes
router.post('/updatePlanner', async (req, res) => {
    try {
        const userID = req.session.name;
        plannerID = userID + '_planner';
        const updatePlanner = await plannerCol.findByIdAndUpdate(plannerID, {entry: req.body});
        res.send("Planner Updated.");
    } catch(e) {

    }

});

module.exports = router;
