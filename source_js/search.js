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

router.post('/movieFile', function(req,res) {
    console.log("movieFile executed");
    console.log("req: " + req);
    // var requestVal = req.body;
    // console.log("requestVal: " + requestVal.Title);
    // console.log("req: " + req);
    if(req.body.Title == null)
    {
        res.statusCode = 404;
        return res.json("NONE");
    }
    var request     = "%" + req.body.Title + "%";
    var yearRequest = req.body.Year;
    var type = null;
    if(req.body.genre != null)
        type        = req.body.genre.name;
    console.log("request: " + type + yearRequest);
    //if there is a filter, do a join
    //select * from title, kind_type join kind_type on title.kind_id = kind_type.id
    connection.query({
      sql: 'SELECT  t1.title, t1.production_year, k2.kind FROM title t1 JOIN kind_type k2 on k2.id = t1.kind_id and t1.title LIKE ? and (t1.production_year = ? or ? IS NULL) and (k2.kind = ? or ? IS NULL) LIMIT 15',
      timeout: 40000, // 40s
      values: [request, yearRequest, yearRequest, type, type]
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
        console.log("fuck this");
        var topResults = results;
        //for(var i = 0; i < topResults.length; i++){
        //    console.log(topResults[i]);
     //  }
        return res.json(topResults);
    });
});

module.exports = router;
