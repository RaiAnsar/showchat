var express    = require('express')
var path       = require('path');
var router     = express.Router(); 
var connection = require('./connection');

router.get('/', function(req, res){
    var originalUrl = req.originalUrl;
    var urlVal      = req.url;
    var urlFile     = originalUrl + ".html";
    console.log("urlFile: " + urlFile);
    res.sendFile(urlFile, { root: path.join(__dirname, "../public/")});
});

router.post('/loginUser', function(req,res) {
    console.log("login attempt");
    console.log("req: " + req);
    // var requestVal = req.body;
    // console.log("requestVal: " + requestVal.Title);
    // console.log("req: " + req);
    var request     = "%" + req.body.Title + "%";
    var emailRequest = req.body.email;
    var passwordRequest = req.body.password;
    console.log("request: " + request);
    //if there is a filter, do a join
    //select * from title, kind_type join kind_type on title.kind_id = kind_type.id
    connection.query({
      sql: 'SELECT UserID FROM User WHERE Email=? and Password=? ',
      timeout: 40000, // 40s
      values: [emailRequest,passwordRequest]
    }, function (err, results, fields) {
        console.log("connection function executed");
        if (err)
        {
            console.log("some type of error");
            res.statusCode = 500;
                return res.json('Could not login user');      
        }
        if (results.length === 0) {
                console.log("results == 0");
                res.statusCode = 404;
                
                return res.json('user not found');
        }
        
        console.log("passed the login page");
        res.statusCode = 201;
        console.log("here boi");
        //req.session.name = results;
        return res.json(results);
    });
});

module.exports = router;
