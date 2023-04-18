let weather = require('weather-js');
let http = require('http');
let qString = require('querystring');

function servResp(location, res) {

    var page = '<html><head><title>New Location</title></head>'+
        '<body>'+
        '<form method="post">'+
        '<h1>Add A New Location</h1>'+
        'Location (Area name, or ZIP Code) <input type="text" id="location" name="location" required><br>'+
        'Add to Favorite <input type="checkbox" id="favorite" name="favorite"><br>'+
        '<input type="submit" value="Get Location">'+
        '</form>';

        
            
        if (location) {
            weather.find({ search: location, degreeType: 'F' }, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                page += `<br><br><h3> Location Selected: ${location}</h3>`;
                const current = result[0].current;
                page += `<h3>Current Conditions:</h3>`;
                page += `<p>Current Time: ${current.observationtime}</p>`;
                page += `<p>Temperature: ${current.temperature}°F</p>`;
                page += `<p>Feels Like: ${current.feelslike}°F</p>`;
                page += `<p>Skytext: ${current.skytext}</p>`;
                page += `<p>Humidity: ${current.humidity}%</p>`;
                page += `<p>Wind Speed: ${current.windspeed}</p>`;

                page += '<br><form method="post">'+
                        '<p>Do you want to add this location to your account?</p>'+
                        '<input type="submit" value="Yes">'+
                        '<input type="reset" value="No">'+
                        '</form>';
                res.end(page);
            });
        } else {
            page+='</body></html>';
            res.end(page);                                                                  
        }
    }


    http.createServer(function(req, res) {
        console.log(req.method);  //look at method type      
    
        if (req.method == "GET") {
            servResp(undefined, res);
        } else if (req.method == "POST") {
            if (req.method == "POST"){ //Respond to POST                                                                                                        
                console.log(req.url)
    
                var postData = ''; //if its post we need to save the posted params somewhere                                                                    
                req.on('data', function(chunk){
                    postData += chunk; //in this case, chunk is the posted data                                                                             
                });
                req.on('end', function(){
                    console.log(postData);
                    var location = qString.parse(postData).location;
                    console.log(location);
                    servResp(location, res);
                });
    
            }
        }
    }).listen (3000, () => {
        console.log("Server is running");
    })
    