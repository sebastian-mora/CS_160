var mysql = require('mysql');

// ========= DATABASE
// note: as these are internal methods, they assume valid input
let pool = mysql.createPool({
    host: "mysql",
    user: "admin",
    database: "cs160", // Enter the name of your database
    password: "admin" // Enter your password
});


module.exports = pool;


