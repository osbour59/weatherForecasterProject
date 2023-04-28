let mongoose = require('mongoose');
// userSchema.js
// Kyle Osbourne
// Code for subdocuments adapted from https://mongoosejs.com/docs/subdocs.html
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
	}
});


const userCol=mongoose.model('User', userSchema)
module.exports = userCol;
module.exports.schema = userSchema;