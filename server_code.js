var http        = require('http');
var fs          = require('fs');
var formidable  = require('formidable');
var util        = require('util');
var mysql       = require('mysql');
var querystring = require('querystring');
var express     = require('express');
var bodyParser  = require('body-parser');
var routes      = require('./source_js/routes');
var engine      = require('consolidate');
var path        = require('path');
var app         = express();


app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(app.router);

console.log("__dirname: " + __dirname);
app.use(express.static(__dirname + '/public'));
app.use('/source_css', express.static(path.join(__dirname, '/source_css')));
app.use('/source_js', express.static(path.join(__dirname, '/source_js')));
app.use('/foundation', express.static(path.join(__dirname, '/foundation')));
app.use('/foundation-icons', express.static(path.join(__dirname, '/foundation-icons')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
var partialDir = __dirname + '/public/partials';

// console.log('partialDir: ' + partialDir);
// app.set('partials', partialDir);
// app.engine('html', engine.mustache);
// app.set('partials engine', 'html');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'meeseeks',
  database: 'ShowChat'
})

connection.connect(function(err) {
  if (err) 
      throw err;
  console.log('You are now connected...');
})

//app.use(function(req, res) {
//    res.sendFile(partialDir + "/search.html");
//app.get('/', function(req, res){
// res.type('text/plain');
// res.send('Showchat');
//});

//console.log("");

/* For some reason, this should go before the /search app.get */
// app.get('/contactlist', function(req,res){
// 	var json = '';
//     console.log("in the contactlist");
// 	connection.query("SELECT * FROM Contacts", function (err, results, fields) {
//     if (err){
//         res.statusCode = 500;
//         console.log('error');
//     }
//     res.statusCode = 201;
//     res.json(results);
//     });
// });

/* For some reason, this should go before the /search app.get */
// app.post('/contactlist', function(req,res){
// 	connection.query('INSERT INTO Contacts SET ?', [req.body], function (err, results, fields) {
//     if (err)
//         res.statusCode = 500;
//     res.statusCode = 201;
//     res.json(results);
//     });
// });

app.get('/search', function(req, res){
    var originalUrl = req.originalUrl;
    var urlVal      = req.url;
    var urlFile     = originalUrl + ".html";
    console.log("urlFile: " + urlFile);
    res.sendFile(urlFile, { root: path.join(__dirname, "./public/")});
});

//app.get('/:userid', function(req, res) {
//    //get profile page of someone
//    res.send(req.params.userid);
//});
//
//
//app.get('/:movieid', function(req, res){
//    //query a movie id and show general information about it
//    res.type('text/plain');
//    res.send(req.params.movieid);
//});

app.get('/postlist', function(req,res){
	//var json = '';
    console.log("in the postlist");
    res.sendFile('/postlist.html', {root: path.join(__dirname, "./public/")});
});

app.get('/postlistData', function(req,res){
    console.log("in the postlistData");
	connection.query("SELECT Content FROM Posts", function (err, results, fields) {
    if (err){
        throw err;
        res.statusCode = 500;
    }
        console.log("__dirname: " + __dirname);
        res.statusCode = 201;
        res.json(results);
    });
});

app.post('/postlistData', function(req,res){
	connection.query('INSERT INTO Posts SET ?', {Content: req.body.Content, UserId:0, likes:0}, function (err, results, fields) {
        if (err){
            throw err;
            res.statusCode = 500;
        }
              
        res.statusCode = 201;
        console.log(req.body.Content);
        res.json(results);
    });
});

app.post('/movieFile', function(req,res) {
    console.log("movieFile executed");
    console.log("req: " + req);

    // var requestVal = req.body;
    // console.log("requestVal: " + requestVal.Title);
    // console.log("req: " + req);
    var request     = "%" + req.body.Title + "%";
    var yearRequest = req.body.Year;
    console.log("request: " + request);
    //if there is a filter, do a join
    //select * from title, kind_type join kind_type on title.kind_id = kind_type.id
    connection.query({
      sql: 'SELECT t1.title, t1.production_year, k2.kind FROM title t1 JOIN kind_type k2 on k2.id = t1.kind_id and t1.title LIKE ?',
      timeout: 40000, // 40s
      values: [request]
    }, function (err, results, fields) {
        console.log("connection function executed");
        if (err)
        {
            console.log("some type of error");
            res.statusCode = 500;
                return res.json('Could not lookup movie');      
        }
        if (results.length === 0) {
                console.log("results == 0");
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json('movie not found');
        }
        
        console.log("passed the conditionals");
        res.statusCode = 201;
        console.log("results.length: " + results.length);
        var topResults = results.slice(0, 10);
        //for(var i = 0; i < topResults.length; i++){
        //    console.log(topResults[i]);
     //  }
        return res.json(topResults);
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

/* For some reason, this should go before the /search app.get*/
//app.get('/contactlist', function(req,res){
//	var json = '';
//    console.log("in the contactlist");
//	connection.query("SELECT * FROM Contacts", function (err, results, fields) {
//    if (err){
//        res.statusCode = 500;
//        console.log('error');
//    }
//    res.statusCode = 201;
//    res.json(results);
//    });
//});

/* For some reason, this should go before the /search app.get*/
//app.post('/contactlist', function(req,res){
//	connection.query('INSERT INTO Contacts SET ?', [req.body], function (err, results, fields) {
//    if (err)
//        res.statusCode = 500;
//    res.statusCode = 201;
//    res.json(results);
//    });
//});

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

