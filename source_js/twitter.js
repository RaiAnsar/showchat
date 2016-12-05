var http        = require('http');
var express     = require('express')
var path        = require('path');
var router      = express.Router(); 
var connection  = require('./connection');
var Twitter     = require('twitter');

var Showtimes_API_Key = 'BLS6pogu7CzmqSdffyYvMDLvgNkpUEtw';
var showtimesUrl = 'http://api.cinepass.de/v4';
var apiURL       = '/?apikey='+ Showtimes_API_Key;
var showchatArg  = '/showchat';
var finalTrending;
var callback = function(response){
    var str = '';
    console.log(response);
    response.on('data', function(chunk){
        str += chunk;
    });

    response.on('end', function(chunk){
        var j = JSON.parse(str); 
        console.log(j);
    });
    var jsonTweets = '';
    console.log(str);
    client.get('trends/place', {id: 1}, function(error, tweets, response) {
        console.log(tweets);
        //console.log(json.decode(tweets));
        //jsonTweets = json.decode(tweets);
    });
    //turn tweets into a dictionary and check if any of the movie strings is in any of the tweets
    
    finalTrending = ''; //
}
/* Credentials necessary for using the Twitter Api*/
// var twitterApiUrl  = 'https://api.twitter.com';
// var twitterPath    = 'oauth2/token';
// var oauth2         = new OAuth2(key, secret, twitterApiUrl, null, twitterPath, null);
// oauth2.getOAuthAccessToken('', 
//     { 'grant_type': 'client_credentials' }, 
//     function (e, access_token, refresh_token, results){
//         console.log("access_token: ", access_token); 
//     }
// );
router.get('/', function(req, res){
    var originalUrl = req.originalUrl;
    var urlVal      = req.url; 
    var urlFile     = originalUrl + ".html";
    res.sendFile(urlFile, { root: path.join(__dirname, "../public/")});
});

router.post('/refreshTrends', function(req,res){
            var additionalArg = '/?release_date_from=2016-11-01';
            var requestURL    = showtimesUrl + '/movies' + additionalArg + apiURL;

            console.log("requestURL: ", requestURL);
            console.log("Creating a new request");

            var options = {
                hostname: 'http://api.cinepass.de/v4/',
                port: 80,
                path: '/movies',
                method: 'GET',
                key: Showtimes_API_Key
            }

            http.get(requestURL, callback).end(); 
            console.log("in the postlist modularized");
            console.log('__dirname: ' + __dirname);
            console.log('in twitter.js');
            res.statusCode = 201;
            if (finalTrending == null)
            {
                //res.statusCode = 404;
                return res.json("no trending movies right now");
            }
            return res.json(finalTrending);

});

var client = new Twitter({
    consumer_key: 'S0UaBENWK65iIQZ6sN7XxGTaJ',
    consumer_secret: 'ajNxC1uIKlx54X8xH9Rcg765IVZt6BOJAPErD6jJ06Iv8yFIWx',
    access_token_key: '804870141272092672-7tzpJAxbGGs6hX5bIRRU2vqCE5bCkAL',
    access_token_secret: 'VorMhPi9EtMQ8z3dRMLqu7Z0jVIGaT3fAv8ZntNvboJz3'
});

/* This is totally functional, uncomment this code to view tweets
 * based on the value left in the track json value pair. 
 * */
// var param = {track: 'javascript'};
//var stream = client.stream('statuses/filter', param, function(stream){
//        stream.on('data', function(event){
//            // console.log(event && event.text);
//        });
//
//        stream.on('error', function(error){
//            console.log("hello!");
//            console.log("error: ", error);
//          //  throw error;
//        });
//});
//


//client.get('trends/place', {id: 1}, function(error, tweets, response) {
//    console.log(tweets);
//   console.log(json.decode(tweets));
//});

module.exports = router;
