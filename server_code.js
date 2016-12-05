var http             = require('http');
var fs               = require('fs');
var formidable       = require('formidable');
var util             = require('util');
var mysql            = require('mysql');
var querystring      = require('querystring');
var express          = require('express');
var bodyParser       = require('body-parser');
var routes           = require('./source_js/routes');
var engine           = require('consolidate');
var path             = require('path');
var app              = express();
var moviefone        = require('moviefone');
var Twitter          = require('twitter');
var connection       = require('./source_js/connection');

/* Set up for the bodyParser*/
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));

/* Routes */
var postListRouter = require('./source_js/postlist.js');
app.use('/postlist', postListRouter);

var theaterRouter  = require('./source_js/theater.js');
app.use('/theater', theaterRouter);

var searchRouter   = require('./source_js/search.js');
app.use('/search', searchRouter);

var loginRouter  = require('./source_js/login.js');
app.use('/login', loginRouter);

var signupRouter  = require('./source_js/signup.js');
app.use('/signup', signupRouter);

var twitterRouter  = require('./source_js/twitter.js');
app.use('/twitter', twitterRouter);

console.log("__dirname: " + __dirname);

/* Setup For CSS styling*/
app.use(express.static(__dirname + '/public', {index: 'login.html'}));
app.use('/source_css', express.static(path.join(__dirname, '/source_css')));
app.use('/source_js', express.static(path.join(__dirname, '/source_js')));
app.use('/foundation', express.static(path.join(__dirname, '/foundation')));
app.use('/foundation-icons', express.static(path.join(__dirname, '/foundation-icons')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));



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

app.listen(app.get('port'), function(){
 console.log( 'Express Started Up Showchat on Port ' + app.get('port') + '; Press Ctrl-C to Terminate.'); 
});
