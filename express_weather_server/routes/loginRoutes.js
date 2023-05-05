//Route page by Anthony Adass
const express = require('express');
const router = express.Router();
let dbManager = require('../dbManager');
const http = require('http');
const mongoose = require('mongoose');
let crypto = require('crypto');
const userCol = require('../models/userSchema');


/**  genHash function adapted from https://github.com/ProfJake/APWJS_Final_Lab/ */
function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}


// GET Requests 
router.get('/login', function(req, res, next){
    if (req.session.user){
        res.redirect('/index');
    }else{
        res.render('login');
    }
});

// POST Requests
router.post('/login', express.urlencoded({extended:false}), async (req, res, next)=>{
	let untrusted= {user: req.body.userName, password: genHash(req.body.pass)};
	console.log(untrusted.password)
	try{

		let result = await userCol.findOne({_id: req.body.userName});

		if (untrusted.password.toString().toUpperCase()==result.password.toString().toUpperCase()){
			let trusted={name: result._id.toString()};
            req.session.user = trusted;
			res.redirect('/');
            console.log("Successful Login Detected.");
		} else{
			res.redirect('/login');
            console.log("Unsuccessful Login Detected.");	
		}
	} catch (err){
		next(err)	
        console.log(err);
	}
});

//Logs out the user
router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.send(`Logout successful <br><a href='/login'>Return to the Login Page.</a>`)
        }
      });
    } else {
      res.end()
    }
  })
module.exports = router;