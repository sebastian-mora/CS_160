var express = require('express');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const port = 3000;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

let database = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cs160", // Enter the name of your database
  password: "yourPass" // Enter your password
});

database.connect(function(error) {
  if (error) {
    console.log("Error connecting to database");
    console.log(error);
  } else {
    console.log("Connected to database");
  }
});

//Test Query
//let query = "SELECT * FROM task INNER JOIN subtasks ON (task.task_id = subtasks.task_id OR (task.task_id = NULL and subtasks.task_id = NULL)) INNER JOIN comments on task.task_id = comments.task_id";

//Query to get all subtasks
let query = "SELECT * FROM task";

//Query to insert a task into the Database
//let query = `INSERT INTO task (date_created,date_due,title,description,priority) VALUE(` + "curdate(),"  + "curdate()," + `"Testing to see if this insertion works"`+ ","+  `"Insertion testing"` + "," + "2" + `);`;

//Query to update task by task_id
//let query = 'UPDATE task SET description =' + '"Testing update on description attribute"' + 'WHERE task_id =1';

//Query to delete task by task_id
//let query = 'DELETE FROM task WHERE task_id =' + "5";

database.query(query, function(error, result) {
  if (error) {
    console.log("Error in studyset query");
    console.log(error);
  } else {
    console.log(result);
  }
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;


});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port, () => console.log(`CS-160 app listening on port ${port}!`))
