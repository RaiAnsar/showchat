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

router.post('/signupUser', function(req,res) {
    console.log("signing up new user");
    console.log("req: " + req);
    // var requestVal = req.body;
    // console.log("requestVal: " + requestVal.Title);
    // console.log("req: " + req);
    var request     = "%" + req.body.Title + "%";
    var nameRequest = req.body.name;
    var emailRequest = req.body.email;
    var passwordRequest = req.body.password;
    var useridRequest = req.body.userid;
    var favGenreRequest = req.body.genre;
    if(nameRequest == null || emailRequest == null || passwordRequest == null || useridRequest == null || favGenreRequest == null)
    {
        console.log("email is in incorrect format");
        res.statusCode = 404;
        return res.json("error");
    }
    
         
       connection.query({
      sql: 'INSERT INTO User ( `Username`, `Password`, `Name`, `Email`, `FavoriteGenre`) Values (?,?,?,?,?)',
      timeout: 40000, // 40s
      values: [useridRequest,passwordRequest,nameRequest,emailRequest,favGenreRequest]
    }, function (err, results, fields) {
        console.log("connection function executed");
        if (err)
        {
            console.log("some type of error");
            res.statusCode = 500;
                return res.json('Could not signup user');      
        }
        if (results.length === 0) {
                console.log("results == 0");
                // We are able to set the HTTP status code on the res object
                res.statusCode = 404;
                return res.json('signup not found');
        }
               
        console.log("passed the signup page");
        res.statusCode = 201;
        console.log("IM here");
        
        return res.json(results);
    });
    return null;
});


module.exports = router;
