function connectionSetup(){
    var mysql = require('mysql');

    /* Set up connection for MySQL */
    var connection  = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'meeseeks',
      database: 'ShowChat'
    })

    connection.connect(function(err) {
      if (err) 
          throw err;
      console.log('You Are Now Connected To The Database...');
    })
    return connection;
}

var connection = connectionSetup();
module.exports = connection;
