let weather = require('weather-js');
/* test.js
Used to test the weather-js npm package. */
weather.find({ search: 'New York, NY', degreeType: 'F' }, function(err, result) {
  if (err) console.log(err);
  console.log(JSON.stringify(result, null, 2));
});
