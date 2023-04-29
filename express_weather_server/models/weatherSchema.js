/* weatherSchema.js 
Kyle Osbourne */

const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  /* Code adapted from https://zellwk.com/blog/mongoose-subdocuments/ */
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    name: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    degreeType: String
  },
  current: {
    temperature: Number,
    skyCode: String,
    skyText: String,
    observationTime: Date,
    observationPoint: String,
    feelsLikeTemperature: Number,
    humidity: Number,
    windDisplay: String,
    day: String,
    windSpeed: Number
  },
  forecast: [
    {
      lowTemperature: Number,
      highTemperature: Number,
      skyCode: String,
      skyText: String,
      date: Date,
      day: String,
      precipitation: Number
    }
  ]
});

const Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;