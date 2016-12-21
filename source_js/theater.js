"use strict";
var express    = require('express')
var path       = require('path');
var router     = express.Router(); 
var connection = require('./connection');
var http       = require('follow-redirects').http;


/* For This Project, the API key will be send in the URL, 
 * use http headers in other scenarios instead. */
var GoogleMapsAPI_Key = 'AIzaSyBkrymcokjrHuRvMa5EIcmrOsVqFlmMLGw';
var showchatArg  = '/showchat';
var address1     = '';
var returnPlaceId = ''
var currMovies = [];
var Showtimes_API_Key = 'BLS6pogu7CzmqSdffyYvMDLvgNkpUEtw';
var showtimesUrl = 'http://api.cinepass.de/v4';
var apiURL1       = '/?apikey='+ Showtimes_API_Key;
var apiURL        = '&apikey=' + Showtimes_API_Key;
 

router.get('/', function(req, res){
    var originalUrl = req.originalUrl;
    var urlVal      = req.url;
    var urlFile     = originalUrl + ".html";
    res.sendFile(urlFile, { root: path.join(__dirname, "../public/")});
});

var googleMapsClient = require('@google/maps').createClient({
    key: GoogleMapsAPI_Key
    //key: 'AIzaSyBkrymcokjrHuRvMa5EIcmrOsVqFlmMLGw'
});

/* Sends the File to the Front End */
router.get('/recentMovies', function(req, res){
        var additionalArg = '&release_date_from=2016-11-01&countries=US';
            var requestURL    = showtimesUrl + '/movies' + apiURL1 + additionalArg;

            console.log("requestURL: ", requestURL);
            console.log("Creating a new request");

            http.get(requestURL, (response) => {
                var str = '';
                var tweetNames = [];
                response.on('data', function(chunk){
                    str += chunk;
                });

                response.on('end', function(chunk){
                    var movieJson = JSON.parse(str);
                    //console.log(movieJson.movies.length);
                    console.log("end");

                    for(var i = 0; i < movieJson.movies.length; i++) {
                        var obj = movieJson.movies[i];
                        //console.log(obj.title); 
                        currMovies.push(obj);
                    }

                    var jsonTweets = '';
                   // console.log('tweetNames: ',tweetNames);
                    //console.log('trending movies: ', currMovies);
                    //res.statusCode = 201;
                    if (currMovies == null)
                    {
                        return "no trending movies right now";
                    }
                    res.statusCode = 201;
                    return res.json({currMovies:currMovies});
                });
            });
});


/* Handles Google Maps Seearch */
router.post('/search', function(req, res){
    console.log(req.body.movieName);
    console.log(req.body.address);
    console.log("Executing a search request");
    //console.log(req.body.genre);

    var movieName = req.body.movieName;
    var address   = req.body.address;
    // var genre     = req.body.genre;
    googleMapsClient.geocode({
        address: address
    }, function(err, response) {
        if(!err){
            console.log("response.json.results", response.json.results);
 var resultArray     = response.json.results;
            var relevantResults = resultArray[0];
            var resultGeometry  = relevantResults.geometry;
            var latitude        = resultGeometry.location.lat;
            var placeid         = relevantResults.place_id;
            var longitude       = resultGeometry.location.lng;

            var truncLatitude  = latitude.toFixed(3);
            var truncLongitude = longitude.toFixed(3);
            console.log("truncLatitude", truncLatitude);
            console.log("truncLongitude", truncLongitude);
            var radius        = 8;
            var additionalArg = '/?location=' + truncLatitude + ',' + truncLongitude + "&radius=" + radius + "&keyword=" + movieName;
            var requestURL    = showtimesUrl + '/cinemas' + additionalArg + apiURL;

            /*viar httpPromise = new Promise(function(fufill, reject){
            http.get(requestURL, callback).done(function(res){
                    console.log("yoooooooo", res);
                });
            });*/
            http.get(requestURL, (response) => {
                var str = '';
                response.on('data', function(chunk){
                    str += chunk;
                });

                response.on('end', function(chunk){
                var j = JSON.parse(str);
                 // lat =  j.cinemas[0].location.lat;
                 // lon =  j.cinemas[0].location.lon;
        
                address1 = j.cinemas[0].location.address.display_text;
                console.log(address1);

                googleMapsClient.geocode({
                    address: address1               
                }, function(err, response1){
                    if(!err)
                    {
                    
                        var resultArray1     = response1.json.results;
                        var relevantResults1 = resultArray1[0];
                        var resultGeometry1  = relevantResults1.geometry;
                        var latitude1        = resultGeometry1.location.lat;
                        var placeid1         = relevantResults1.place_id;
                        var longitude1       = resultGeometry1.location.lng;
                        console.log("placeid1: ", placeid1);
                        returnPlaceId        = placeid1;
                        console.log("returnPlaceId: ", returnPlaceId);
                        
                        return res.json({theaterLocation: returnPlaceId, initialLocation: placeid});
                    }
                   });
        
                });
            });
        } 
     });          
});

module.exports = router;
