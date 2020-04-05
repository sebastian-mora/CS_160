var mysql = require('mysql');

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
// todo: add errors, we want the tasks route to be able to report the error in the response message, rather than logging
// here...perhaps errors or a status string, that if not empty indicates the error that occurred?
function addTask(taskJson) {
  let query = `INSERT INTO task (date_created,date_due,title,description,priority) VALUES("` + taskJson.date_created + `","` + taskJson.date_due + `","` + taskJson.title + `","` + taskJson.description + `","` + taskJson.priority +`")`;
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error in task query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}

function updateTask(taskJson) {
  let query = `UPDATE task (uid, date_created,date_due,title,description,priority) VALUES("` + taskJson.uid + taskJson.date_created + `","` + taskJson.date_due + `","` + taskJson.title + `","` + taskJson.description + `","` + taskJson.priority +`")`;
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error updating task query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}

// lookupTask(uid: int) => json | {} if not found
function lookupTask(uid){
  let query = 'SELECT * FROM task WHERE uid="' + uid + '" LIMIT 1';
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error looking up task query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}

// lookupTasks(createdAfter: date, createdBefore: date) => list[json] | {} if none in time range
function lookupTasks(createdAfter, createdBefore){
  let query = 'SELECT * FROM task WHERE date_created BETWEEN "' + createdAfter.toISOString() +'" AND "' + createdBefore.toISOString() + '"';
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error in looking up multiple tasks query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}
