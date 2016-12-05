var express    = require('express')
var path       = require('path');
var router     = express.Router(); 
var connection = require('./connection');

router.get('/', function(req,res){
	//var json = '';
    //console.log("in the postlist modularized");
    //console.log('__dirname: ' + __dirname);
    res.sendFile('/postlist.html', {root: path.join(__dirname, "../public/")});
});

/* Handle get requests for /data*/
router.get('/data', function(req,res){
    //console.log("in the postlistData modularized");
	connection.query("SELECT Content, likes FROM Posts", function (err, results, fields) {
    if (err){
        throw err;
        res.statusCode = 500;
    }
        //console.log("__dirname: " + __dirname);
        res.statusCode = 201;
        res.json(results);
    });
});

/* Handle post request for /data */
router.post('/data', function(req,res){
	connection.query('INSERT INTO Posts SET ?', {Content: req.body.Content, UserId:0, likes:0}, function (err, results, fields) {
        if (err){
            throw err;
            res.statusCode = 500;
        }
              
        res.statusCode = 201;
        //console.log("results: ", results);
        res.json(results);
    });
});

router.post('/deletePost', function(req,res){
    var PostContent = req.body.PostContent;
   // console.log("Value of PostID in the servercode: " + PostID);
    console.log("PostContent: " + PostContent);
	connection.query('Delete from Posts Where Content = ?', PostContent, function (err, results, fields) {
        if (err){
            throw err;
            res.statusCode = 500;
        }

        res.statusCode = 201;
        //console.log(req.body.Content);
        res.json(results);
    });
});

router.post('/like', function(req,res){
    var PostContent = req.body.PostContent;
    var likes = req.body.Likes + 1;
    console.log(likes);
   	connection.query('Update Posts Set likes=? where Content = ?', [likes, PostContent], function (err, results, fields) {
        if (err){
            throw err;
            res.statusCode = 500;
        }

        res.statusCode = 201;
        //console.log(req.body.Content);
        res.json(results);
    });
});

module.exports = router;
