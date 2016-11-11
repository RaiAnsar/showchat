var http       = require('http');
var fs         = require('fs');
var formidable = require('formidable');
var util       = require('util');
var mysql      = require('mysql');

function DB(){
    var connection = mysql.createConnection({
        user: 'root',
        password: 'meeseeks',
        host: 'localhost',
        port: 3306,
        database: 'showchat'
    });
    return connection;
}

var server = http.createServer(function (req, res){
    if(req.method.toLowerCase() === 'get'){
        displayForm(res);
    } else if (req.method.toLowerCase() === 'post'){
        processAllFieldsOfTheForm(req, res);
    }
});

function displayForm(res){
    fs.readFile('public/index.html', function(err, data){
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });

        res.write(data);
        res.end();
    });
}

function processResults(res, result,fields){
     val = result;
     if(val){
         if(val.length > 0){
             console.log(val[0].Name);
         }
     }

     for(i = 0; i < val.length; i++){
        var resultsStr = "";
        resultsStr += (val[i].Name + "\n\n");
        res.write(resultsStr + '\n')
     }

     //res.json(val);
     //res.end(util.inspect({
     //    fields: fields,
     //    results: resultsStr
     //}));
}

function processAllFieldsOfTheForm(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        res.writeHead(200, {
            'content-type': 'text/plain'
        });

        var objDB = DB();
        //res.write('received the data:\n\n');
        var vals = fields;
        console.log(fields);
        console.log(typeof fields);
        var title = "\'(" + fields["Title"] + "*)\'";
        var ID    = "\'(" + fields["ID"]    + "*)\'";
        var year  = "\'(" + fields["Year"]  + "*)\'";
        var genre = "\'(" + fields["genre"] + "*)\'";
        console.log(title);

       var mysqlCommand = "SELECT * from Movie WHERE name RLIKE " + title 
       //var mysqlCommand = "SELECT * from Movie"
       console.log(mysqlCommand);
       var val;
       objDB.query(mysqlCommand, function(err, result) {
         if(err){
             console.log(err.message);
         } 
       processResults(res, result, fields);
    });
 });
}

const port = 8080;
server.listen(port);
console.log('server listening on: ' + port);
