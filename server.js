var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'meeseeks',
	database: 'ShowChat'
});

app.get('/search', function(req,res){
	
	var request = "%" + req.body.queryVal + "%";

	connection.query({sql:'SELECT title FROM title Where title LIKE ?', timeout:20000, values: [request]}, function (err, results, fields) {
 
		if (err){

		    res.statusCode = 500;
		    throw err;
		}
		    
		if (results.length === 0) 
		{
            // We are able to set the HTTP status code on the res object
            res.statusCode = 404;
            return res.json('movie not found');
        }
	      
		res.statusCode = 201;
	  
		res.json(results.slice(0, Math.min(results.length-1,10)));
			console.log(results[0]);
    	});

	
});

app.post('/search', function(req,res){
	
	
	connection.query('INSERT INTO Contacts SET ?', [req.body], function (err, results, fields) {
 
		if (err)
		    res.statusCode = 500;
		
	      
		res.statusCode = 201;
	  
		res.json(results);
    	});

	
});



app.use(express.static(__dirname + "/public"));

connection.connect();

app.listen(4000);



