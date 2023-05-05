/** 
 * weatherSchema.js
 * Kyle Osbourne
 * Purpose: This schema is used to handle locations that will be stored onto the database.
 */

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
    forecast: [
      {
        lowTemperature: Number,
        highTemperature: Number,
        skyCode: String,
        skyText: String,
        day: String,
        precipitation: Number
      }
    ]
  });

const weatherCol=mongoose.model('Weather', weatherSchema)
module.exports = weatherCol;