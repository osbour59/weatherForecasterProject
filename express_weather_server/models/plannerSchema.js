let mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({

});

const plannerCol=mongoose.model('Planner', plannerSchema)
module.exports = plannerCol;