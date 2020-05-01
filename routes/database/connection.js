var mysql = require('mysql');

// ========= DATABASE
// note: as these are internal methods, they assume valid input
let database = mysql.createConnection({
    host: "mysql",
    user: "admin",
    database: "cs160", // Enter the name of your database
    password: "admin" // Enter your password
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


