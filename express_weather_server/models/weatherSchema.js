/* weatherSchema.js 
Kyle Osbourne */

let mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema( {
  _id: String,
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

const weatherCol=mongoose.model('Weather', weatherSchema)
module.exports = weatherCol;