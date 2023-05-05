let weather = require('weather-js');
/* test.js
This file was used to test the weather-js npm package, for debugging purposes. */
weather.find({ search: 'New York, NY', degreeType: 'F' }, function(err, result) {
  if (err) console.log(err);
  console.log(JSON.stringify(result, null, 2));
});
