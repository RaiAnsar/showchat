"use strict";
var express           = require('express')
var path              = require('path');
var router            = express.Router(); 
var connection        = require('./connection');
var http              = require('follow-redirects').http;

/* For This Project, the API key will be send in the URL, 
 * use http headers in other scenarios instead. */
var Showtimes_API_Key = 'BLS6pogu7CzmqSdffyYvMDLvgNkpUEtw';
var GoogleMapsAPI_Key = 'AIzaSyBkrymcokjrHuRvMa5EIcmrOsVqFlmMLGw';
var showtimesUrl = 'http://api.cinepass.de/v4';
var apiURL       = '/?apikey='+ Showtimes_API_Key;
var showchatArg  = '/showchat';
var lat = '';
var lon = '';

var callback = function(response){
    var str = '';
    response.on('data', function(chunk){
        str += chunk;
    });

    response.on('end', function(chunk){
        var j = JSON.parse(str);
        lat =  j.cinemas[0].location.lat;
        lon =  j.cinemas[0].location.lon;
        console.log(lat);
    });
}

var googleMapsClient = require('@google/maps').createClient({
    key: GoogleMapsAPI_Key
    //key: 'AIzaSyBkrymcokjrHuRvMa5EIcmrOsVqFlmMLGw'
});

/* Sends the File to the Front End */
router.get('/', function(req, res){
    var originalUrl = req.originalUrl;
    var urlVal      = req.url; 
    var urlFile     = originalUrl + ".html";
    res.sendFile(urlFile, { root: path.join(__dirname, "../public/")});
});


/* Handles Google Maps Seearch */
router.post('/search', function(req, res){
    console.log(req.body.movieName);
    console.log(req.body.address);
    //console.log(req.body.genre);

    var movieName = req.body.movieName;
    var address   = req.body.address;
    // var genre     = req.body.genre;
    googleMapsClient.geocode({
        address: address
    }, function(err, response) {
        if(!err){
            /* https://developers.google.com/maps/documentation/geocoding/intro
             * Refer to the above link to look up how to geocode locations. 
             *
             * Each address needs to be converted to latitude and longitude to be
             * use with the international showtimes API.
             * */
            console.log("Processing Address Conversion");
            /* resultArray returns an array, so far the relevant information is only
             * in the first index of the array 
             * */
            console.log("response.json.results", response.json.results);
            var resultArray     = response.json.results;
            var relevantResults = resultArray[0];
            var resultGeometry  = relevantResults.geometry;
            var latitude        = resultGeometry.location.lat;
            var placeid         = relevantResults.place_id;
            var longitude       = resultGeometry.location.lng;

            var truncLatitude  = latitude.toString().toFixed(3);
            var truncLongitude = longitude.toString().toFixed(3);
        
            /* Debugging infomation to make sure each variable has the correct value
             * */
            console.log("relevantResults", relevantResults);
            console.log("resultGeometry", resultGeometry);
            console.log("latitude", latitude);
            console.log("longitude", longitude);
            console.log("truncLatitude", truncLatitude);
            console.log("truncLongitude", truncLongitude);

            /* Requests to the International Showtimes API will follow this form
             * Example: http://api.cinepass.de/v4/cinemas/?apikey=YOUR_API_KEY
	console.log("hello");
             * I'm not sure if you have to make a get or a post request to this url
             * Check the documentation here: 
             * https://api.cinepass.de/documentation/v4/
             * To look up how to pass arguments to the URL.  
             * */
            var additionalArg = '';
            var requestURL    = showtimesUrl + '/cinemas' + additionalArg + apiURL;

            console.log("requestURL: ", requestURL);
            console.log("Creating a new request");

            var options = {
                hostname: 'http://api.cinepass.de/v4/',
                port: 80,
                path: '/cinemas',
                method: 'GET',
                key: Showtimes_API_Key
            }

            http.get(requestURL, callback).end();              
        }
    });
});

module.exports = router;
