let mongoose = require('mongoose');
// userSchema.js
// Kyle Osbourne
const userSchema = new mongoose.Schema({
    _id: {
		type: String,
		required: [true, 'You must enter a username.'],
		unique: [true, 'This username is taken.']
},
    displayName: String,
    age: Number,
    email:{
		type: String,
		required: [true, 'You must enter an email address.'],
		unique: [true, 'This email is taken.']
	},
	email_verified:{
		type: Boolean,
		default: false
	},
    password:{
		type: String,
		required: [true, 'You must enter a password.'],
	}
});


const userCol=mongoose.model('User', userSchema)
module.exports = userCol;
module.exports.schema = userSchema;