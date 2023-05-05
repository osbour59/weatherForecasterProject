let mongoose = require('mongoose');

/** 
 * userSchema.js
 * Kyle Osbourne
 * Purpose: This schema handles user information, as well as some subproperties to a user's account
 * such as their favorite locations or their preference for dark mode.
 * Base user schema code adapted from https://github.com/ProfJake/APWJS_Final_Lab/
 * Code for subdocuments adapted from https://mongoosejs.com/docs/subdocs.html
 */
const favoriteLocationSchema = new mongoose.Schema({
    region: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

const userSchema = new mongoose.Schema({
    _id: {
		type: String,
		required: [true, 'You must enter a username.']
},
    displayName: String,
    age: Number,
    email:{
		type: String,
		required: [true, 'You must enter an email address.']
	},
    password:{
		type: String,
		required: [true, 'You must enter a password.'],
	},
    favoriteLocations: [favoriteLocationSchema],
    preferences: {
        darkMode: {
            type: Boolean, default: false 
        }
      }
});


const userCol=mongoose.model('User', userSchema)
module.exports = userCol;
module.exports.schema = userSchema;