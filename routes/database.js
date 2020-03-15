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

function addTask(taskJson){
  test = {
        "uid": 1,
        "date_created": "2020-02-24T15:16:30.000Z",
        "date_due":     "2020-02-25T15:16:30.000Z",
        "title":        "my dummy task title",
        "description":  "my dummy description",
        "priority": "high",
        "tags":     [],
        "comments": [],
        "subtasks": []
    }
  let query = `INSERT INTO task (date_created,date_due,title,description,priority) VALUES("` + test.date_created + `","` + test.date_due + `","` + test.title + `","` + test.description + `","` + test.priority +`")`;
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error in task query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}

function lookupTask(uid){
  uid = 1;
  let query = 'SELECT * FROM task WHERE uid="'+uid +'"';
  database.query(query, function(error, result) {
    if (error) {
      console.log("Error in task query");
      console.log(error);
    } else {
      console.log(result);
    }
  });
}
