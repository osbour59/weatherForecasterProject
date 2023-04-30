let mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    _id: String,
    entry: String
});

const plannerCol=mongoose.model('Planner', plannerSchema)
module.exports = plannerCol;