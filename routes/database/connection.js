var mysql = require('mysql');

// create pool so connections are managed by the server when querying
let pool = mysql.createPool({
    host: "mysql",
    user: "admin",
    database: "cs160",
    password: "admin"
});

module.exports = pool;
