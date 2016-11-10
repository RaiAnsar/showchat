var path    = require('path');
var express = require('express');

var app = express();
var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

const PORT = 8080;
app.listen(PORT, function(){
    console.log('listening on port: ' + PORT);
});
