var path        = require('path');
var express     = require('express');
var http        = require('http');
var fs          = require('fs');
var formidable  = require('formidable');
var util        = require('util');
var mysql       = require('mysql');
var querystring = require('querystring');
var bodyParser  = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use('/source_css', express.static(__dirname + '/source_css'));
app.use('/source_js', express.static(__dirname + '/source_js'));
app.use('/foundation', express.static(__dirname + '/foundation'));
app.use('/foundation-icons', express.static(__dirname + '/foundation-icons'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.set('port', process.env.PORT || 8080);
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'meeseeks',
  database: 'ShowChat'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
});


app.get('/', function(req, res){
 res.type('text/plain');
 res.send('Showchat');
});
app.get('/{profile}', function(req, res){
 res.type('text/plain');
 res.send('_____\'s profile page');
});

app.get('/{movie-id}', function(req, res){
 res.type('text/plain');
 res.send('about this movie');
});

app.post('movieFile', function(req,res) {
    var request = console.log(req.body.queryVal);
    console.log(request);
	connection.query({
	    sql: 'SELECT * FROM `title` WHERE `title` = ?',
	  timeout: 40000, // 40s
	  values: ['movie_name']
	}, function (err, results, fields) {
		  if (err) throw err;
      console.log(results.length);
		// error will be an Error if one occurred during the query
  		// results will contain the results of the query
  		// fields will contain information about the returned results fields (if any)
	});
});


// custom 404 page
app.use(function(req, res){
 res.type('text/plain');
 res.status(404);
 res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.type('text/plain');
 res.status(500);
 res.send('500 - Server Error');
});


// const PORT = 8080;
// app.listen(PORT, function(){
//     console.log('listening on port: ' + PORT);
// });

app.listen(app.get('port'), function(){
    console.log( 'Express started up showchat' +
                 app.get('port') + '; press Ctrl-C to terminate.');
});
