var path    = require('path');
var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use('/source_css', express.static(__dirname + '/source_css'));
app.use('/source_js', express.static(__dirname + '/source_js'));
app.use('/foundation', express.static(__dirname + '/foundation'));
app.use('/foundation-icons', express.static(__dirname + '/foundation-icons'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


const PORT = 8080;
app.listen(PORT, function(){
    console.log('listening on port: ' + PORT);
});
