let mongoose = require('mongoose');
var crypto = require('crypto');

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
	email_verified:{
		type: Boolean,
		default: false
	},
    password:{
		type: String,
		required: [true, 'You must enter a password.']
        // Hash Password
	}
});

const userCol=mongoose.model('User', userSchema)
module.exports = userCol;