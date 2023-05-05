# Weather Forecaster Project

# Objective 
The objective of this program is to serve as a weather forecaster that can allow the user to store weather information relating to whatever location they choose.  The user can search for a location either by region name or ZIP code.
<br>
Information relating to the user, such as username, preferred name, email address, weather locations they want, etc. is stored in database collections to be retrieved.

# Features
Users can create their own accounts to use the program.
<br>
Users can retrieve 5-day weather forecasts for regions based on region name or ZIP code that are saved to their account.  These locations as well as their forecasts can be viewed or deleted.
<br>
Users can add favorite locations to their account that will be displayed on their front page.
<br>
Users can utilize a planner which entry will be displayed on the Index.
<br>
Users can use the settings to change their personal information and even switch to Dark Mode.
<br>

# Required NPM packages
weather-js (available via npm) - Retrieves weather information to be used, utilizes MSN's weather services.
<br>
mongodb (available via npm) - Used for storage relating to user information and weather information.
<br>
mongoose (available via npm)
<br>
express (available via npm) - Used for middleware and Routing for Node related apps.
<br>
express-session (available via npm)
<br>
cookie-parser (available via npm) - Used for middleware to parse cookies
<br>
pug (available via npm) - Templating engine for generating HTML pages
<br>
crypto - Used to handle password encryption.
<br>

# Additional Notes
This program runs on MongoDB version 5.1.0.
