var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'meeseeks',
	database: 'test'
});

app.get('/contactlist', function(req,res){
	
	var json = '';

	connection.query("SELECT * FROM Contacts", function (err, results, fields) {
 
		if (err)
		    res.statusCode = 500;
		    
		
	      
		res.statusCode = 201;
	  
		res.json(results);
    	});

	
});

app.post('/contactlist', function(req,res){
	
	
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



