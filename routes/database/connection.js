var mysql = require('mysql');


let database = mysql.createConnection({
    host:     "<YOUR-HOSTNAME-HERE>",
    user:     "<YOUR-USERNAME-HERE>",
    database: "<YOUR-DBNAME-HERE>",
    password: "<YOUR-PASSWORD-HERE>"
});

database.connect(function (error) {
    if (error) {
        console.log("Error connecting to database");
        console.log(error);
    } else {
        console.log("Connected to database");
    }
});

module.exports = database;
