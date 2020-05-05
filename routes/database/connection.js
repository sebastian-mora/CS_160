var mysql = require('mysql');

// ========= DATABASE
// note: as these are internal methods, they assume valid input
let pool = mysql.createPool({
    host: "10.0.0.219",
    user: "seb",
    database: "sqldev", // Enter the name of your database
    password: "test" // Enter your password
});


module.exports = pool;


