var http       = require('http');
var fs         = require('fs');
var formidable = require('formidable');
var util       = require('util');
var mysql      = require('mysql');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));
app.use('/source_css', express.static(__dirname + '/source_css'));
app.use('/source_js', express.static(__dirname + '/source_js'));
app.use('/foundation', express.static(__dirname + '/foundation'));
app.use('/foundation-icons', express.static(__dirname + '/foundation-icons'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/public/partials', express.static(__dirname + '/public/partials'));



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'meeseeks',
  database: 'ShowChat'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
});


app.get('/', function(req, res){
 res.type('text/plain');
 res.send('Showchat');
});

app.get('/:userid', function(req, res) {
    //get profile page of someone
    res.send(req.params.userid);
  });


app.get('/search', function(req, res) {
    //get profile page of someone
    res.send(req.query);
    console.log('executed search');
});

app.get('/:movieid', function(req, res){
    //query a movie id and show general information about it
    res.type('text/plain');
    res.send(req.params.movieid);
});

app.post('/movieFile', function(req,res) {
     var request = "%" + req.body.queryVal + "%";

    //if there is a filter, do a join
    //select * from title, kind_type join kind_type on title.kind_id = kind_type.id

    connection.query({
      sql: 'SELECT * FROM `title` WHERE `title` LIKE ?',
      timeout: 40000, // 40s
      values: [request]
    }, function (err, results, fields) {
        
        if (err)
        {
            res.statusCode = 500;
                return res.json('Could not lookup movie');      
        }
        if (results.length === 0) {
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json('movie not found');
            }
        
        res.statusCode = 201;
        for(var i = 0; i < results.length; i++){
            console.log(results[i]);
        }
        return res.json(results.slice(0,10));

        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
});

app.post('/signup', function(req,res) {

    connection.query({
      sql: 'INSERT INTO `User` values `?,?,?,?,?,?,?`',
      timeout: 40000, // 40s
      values: [UserID, Username, Password, Name, Email, FavoriteGenre, Birthdate]
    }, function (err, results, fields) {
        
                

        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
});

app.post('/addfriend',function(res,req) {
    var request = req.body.queryVal;
    connection.query({
        sql: 'INSERT INTO Friendship `?,?,?,?`',
        values: [req.body.userID1,req.body.UserID2, req.body.time, req.body.status]
    }, function (err, results, fields) {
        
                

        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
    });
        



})

// custom 404 page
//app.use(function(req, res){
// res.type('text/plain');
// res.status(404);
// res.send('404 - Not Found');
//});

// custom 500 page
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.type('text/plain');
 res.status(500);
 res.send('500 - Server Error');
});


/*
function lookupUser(req, res, next) {
  // We access the ID param on the request object
  var photoId = req.params.id;
  // Build an SQL query to select the resource object by ID
  var sql = ‘SELECT * FROM photo WHERE id = ?’;
  postgres.client.query(sql, [ photoId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: [‘Could not retrieve photo’] });
    }
    // No results returned mean the object is not found
    if (results.rows.length === 0) {
      // We are able to set the HTTP status code on the res object
      res.statusCode = 404;
      return res.json({ errors: [‘Photo not found’] });
    }
    // By attaching a Photo property to the request
    // Its data is now made available in our handler function
    req.photo = results.rows.slice(0,10);
    next();
  });
}

function lookupMovie(req, res, next) {
  // We access the ID param on the request object
  var photoId = req.params.id;
  // Build an SQL query to select the resource object by ID
  var sql = ‘SELECT * FROM photo WHERE id = ?’;
  postgres.client.query(sql, [ photoId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: [‘Could not retrieve photo’] });
    }
    // No results returned mean the object is not found
    if (results.rows.length === 0) {
      // We are able to set the HTTP status code on the res object
      res.statusCode = 404;
      return res.json({ errors: [‘Photo not found’] });
    }
    // By attaching a Photo property to the request
    // Its data is now made available in our handler function
    req.photo = results.rows.slice(0,10);
    next();
  });
}

function lookupShow(req, res, next) {
  // We access the ID param on the request object
  var photoId = req.params.id;
  // Build an SQL query to select the resource object by ID
  var sql = ‘SELECT * FROM photo WHERE id = ?’;
  postgres.client.query(sql, [ photoId ], function(err, results) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      return res.json({ errors: [‘Could not retrieve photo’] });
    }
    // No results returned mean the object is not found
    if (results.rows.length === 0) {
      // We are able to set the HTTP status code on the res object
      res.statusCode = 404;
      return res.json({ errors: [‘Photo not found’] });
    }
    // By attaching a Photo property to the request
    // Its data is now made available in our handler function
    req.photo = results.rows.slice(0,10);
    next();
  });
}
*/

app.listen(app.get('port'), function(){
 console.log( 'Express started up showchat' +
 app.get('port') + '; press Ctrl-C to terminate.');
});
