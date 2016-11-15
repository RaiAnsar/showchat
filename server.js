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
	
	var request = "%" + req.body.title + "%";

	connection.query('SELECT t1.title, t1.year, k.kind FROM title t1, kind_type k join (select k.kind from kind_type k1) k2 on k2.id = t1.kind_id where t1.title LIKE ?', {title: request},  
		function (err, results, fields) {
 
		if (err){
			throw err;
		    res.statusCode = 500;
		}
		    
		
	      
		res.statusCode = 201;
	  
		res.json(results);
    	});

	
});


app.use(express.static(__dirname + "/public"));

connection.connect();

app.listen(4000);



