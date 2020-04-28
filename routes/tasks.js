// ========= IMPORTS
const express = require('express');
const router = express.Router();
var mysql = require('mysql');


// ========= UTILITIES
// note: all functions use datetimes STRICTLY of the format '2011-10-05T14:48:00.000Z'

function getEpochDate()     { return new Date(0); }
function getCurrentDate()   { return new Date(); }
function isDate(date)       { return typeof date && date instanceof Date; }
function isString(text)     { return typeof text === 'string' || text instanceof String; }

// hasExactFields(obj: object, fieldNames: array[string]) => bool
// ex: hasExactFields({'foo': 1, 'bar': 2}, ...['foo', 'bar']) => true
// ex: hasExactFields({'foo': 1, 'bar': 2}, ...['foo', 'bar', 'baz']) => false
// ex: hasExactFields({'foo': 1, 'bar': 2}, ...['foo']) => false
function hasExactFields(obj, fieldNames) {
    if (Object.keys(obj).length !== fieldNames.length) {
        return false;
    }
    for (var i = 0; i < fieldNames.length; i++) {
        if (!obj.hasOwnProperty(fieldNames[i])) {
            console.log("missing field: " + fieldNames[i]);
            return false;
        }
    }
    return true;
}
function isValidISODateString(text) {
    const date = new Date(text);
    return isString(text) && isDate(date) && text === date.toISOString();
}
function isEmptyObject(obj) {
    return obj === null ||
        obj === undefined ||
        Array.isArray(obj) ||
        typeof obj !== 'object' || Object.getOwnPropertyNames(obj).length === 0;
}


// ========= DATABASE
// note: as these are internal methods, they assume valid input
let database = mysql.createConnection({
  host: "10.0.0.219",
  user: "seb",
  database: "sqldev", // Enter the name of your database
  password: "test" // Enter your password
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
    let query = `INSERT INTO task (date_due,title,description,priority,status) VALUES( '${taskJson.date_due}', '${taskJson.title}', '${taskJson.description}', '${taskJson.priority}', '${taskJson.status}')`
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error in task query");
            console.log(error);
        } else {
            console.log(result);
        }
    });
}

function addSubTask(subtask){
    let query = `INSERT INTO subtasks (title, task_id, status) VALUES('${subtask.title}', '${subtask.task_id}', 'open')`;
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error in task query");
            console.log(error);
        } else {
            console.log(result);
        }
    });
}


function deleteSubTask(subtask_id){
    let query = `UPDATE subtasks SET status='closed' WHERE subtask_id='${subtask_id}';`;
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error in task query");
            console.log(error);
        } else {
            console.log(result);
        }
    });
}

function updateTask(uid, taskJson) {
    let query = `UPDATE task SET date_due='${taskJson.date_due}', title='${taskJson.title}', description='${taskJson.description}', priority='${taskJson.priority}', status='${taskJson.status}' WHERE uid=${uid}`
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error updating task query");
            console.log(error);
        } else {
            console.log(result);
        }
    });
}

// let query = 
// lookupTask(uid: int) => json | {} if not found
function lookupTask(search){
   
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
  
        var query_str = `SELECT * FROM task WHERE title LIKE '%${search}%'`;

        database.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// lookupTasks(createdAfter: date, createdBefore: date) => list[json] | {} if none in time range
function lookupTasks(createdAfter, createdBefore){

  return new Promise(function(resolve, reject) {
      // The Promise constructor should catch any errors thrown on
      // this tick. Alternately, try/catch and reject(err) on catch.

      var query_str = 'SELECT * FROM task WHERE date_created BETWEEN "' + createdAfter.toISOString() +'" AND "' + createdBefore.toISOString() + '"';

      database.query(query_str, function (err, rows, fields) {
          // Call reject on error states,
          // call resolve with results
          if (err) {
              return reject(err);
          }
          resolve(rows);
      });
  });
}


function lookupSubTasks(task_uid){

    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
  
        var query_str = `SELECT * FROM subtasks WHERE task_id='${task_uid}'`;
  
        database.query(query_str, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
  }



isOpen = (task) => {
  return task.status == 'open'
}

// ========= ENDPOINTS

/*
--- Fetch a Task ---
Fetch a single task, with nonexistence treated as a 404 error

Syntax:
    GET <host>/tasks/<unique-integer-id>
Example Usage:
    curl -v http://127.0.0.1:3000/tasks
*/
router.get('/search', function(req, res) {
    const search = req.query['search'];
    
    if (search) {

        tasks = lookupTask(search).then(function(rows) {
            const message =  "Fetched ALL " + rows.length + " task(s)";
            console.log(message);
            
            task_data = rows.filter(isOpen)
            res.render('pages/index.ejs', {tasks:task_data});
        }).catch((err) => setImmediate(() => { throw err; }));
        
    } else {
        res.status(404).send({
            "status": "error",
            "message": "No task with uid=" + search + " found",
            "data": search
        });
    }
});


/*
--- Fetch All Tasks ---
Fetches all saved tasks in database, no matter how many

Syntax:
    GET <host>/tasks
Example Usage:
    curl --location --request GET 'http://127.0.0.1:3000/tasks'
*/
router.get('/', function(req, res) {
     lookupTasks(getEpochDate(), getCurrentDate()).then(function(rows) {
       const message =  "Fetched ALL " + rows.length + " task(s)";
       task_data = rows.filter(isOpen)
       

        var loop = new Promise((resolve, reject) => {
            task_data.forEach((task, i) => {
                task.subtasks = []

                lookupSubTasks(task.uid).then(function (subrows) {
                    if (i === task_data.length -1) resolve();

                     subrows.forEach(sub => {
                        if(sub.status == 'open'){
                            task.subtasks.push({title:sub.title, subtask_id:sub.subtask_id})
                        }
                        
                     }) 

                });
            });
        })

        loop.then(() =>{
            res.render('pages/index.ejs', {tasks:task_data});
        })

      
       
    }).catch((err) => setImmediate(() => { throw err; }));

    // res.send({
    //     "status": "success",
    //     "data": taskJsons,
    //     "message": "Fetched ALL " + taskJsons.length + " task(s)"
    // });

});


/*
--- Fetch Tasks Within Time Span---
Fetches all tasks between given (inclusive) start and end dates

Syntax:
    GET <host>/tasks?created_after=<iso-datetime>&created_before=<iso-datetime>
Example Usage:
    curl --location --request GET \
    'http://127.0.0.1:3000/tasks?created_after=2020-02-24T15:16:30.000Z&created_before=2020-02-28T15:16:30.000Z'
*/
router.get('/?', function(req, res) {
    const expectedNumParams = 2;
    const start = req.query.created_after;
    const end   = req.query.created_before;
    if (Object.keys(req.query).length === expectedNumParams && isValidISODateString(start) && isValidISODateString(end)) {
        const taskJsons = lookupTasks(new Date(start), new Date(end));
        res.send({
            "status": "success",
            "message": "Fetched " + taskJsons.length + " tasks created between " + start + " and " + end,
            "data": taskJsons
        });
    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected date filters of the exact iso format: {YYYY-MM-DD}T{HH:MM:SS.SSS}Z",
            "data": []
        });
    }
});


const EXPECTED_FIELDS = ['date_due', 'title', 'description', 'tags', 'priority', 'status'];
/*
--- Create ---
Creates a new task, with a uid that is decided upon writing to the database

Syntax:
    POST <host>/tasks @body={
        date_created: <iso-datetime>,
        date_due:     <iso-datetime>,
        priority:     <high>,
        status:       <string> {open, in progress, closed, deleted},
        title:        <string>,
        description:  <string>,
        tags:         <array[string]>,
        comments:     <array[string]>,
        subtasks:     <array[string]>
    }
Example Usage:
    curl --location --request POST 'http://127.0.0.1:3000/tasks' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "priority": "high",
        "status": "open",
        "date_due": "2020-02-25T15:16:30.000Z",
        "title": "TITLE",
        "description": "DETAILS",
        "tags": [],
        "subtasks": []
    }'
*/
router.post('/', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    var isValid, textPayload, taskJson;
    try {
        textPayload = JSON.stringify(req.body);
        taskJson = JSON.parse(textPayload);
        isValid = hasExactFields(taskJson, EXPECTED_FIELDS);
    } catch (error) {
        console.log(error);
        isValid = false;
    }

    if (isValid) {
        addTask(taskJson);
        res.redirect('/tasks')
    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + EXPECTED_FIELDS,
            "data": textPayload
        });
    }
});


/*
--- Edit a Task ---
Fetch a single task, with nonexistence treated as a 404 error

Syntax:
    POST <host>/tasks/<uid> @body={
        date_due:     <iso-datetime>,
        priority:     <high>,
        status:       <string> {open, in progress, closed, deleted},
        title:        <string>,
        description:  <string>,
        tags:         <array[string]>,
        subtasks:     <array[string]>
    }
    Example Usage:
    curl -v http://127.0.0.1:3000/tasks
*/
router.post('/:uid', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    var isValid, textPayload, taskJson;

    try {
        textPayload = JSON.stringify(req.body);
        taskJson = JSON.parse(textPayload);
        // isValid = hasExactFields(taskJson, EXPECTED_FIELDS);
        isValid = true
    } catch (error) {
        console.log(error);
        isValid = false;
    }

    if (isValid) {
        updateTask(req.params.uid, taskJson);
        res.redirect('/tasks')
    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + EXPECTED_FIELDS,
            "data": textPayload
        });
    }
});



// Adding a subtask to existing task 

router.post('/:uid/subtask', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    var isValid, textPayload, taskJson;

    try {
        textPayload = JSON.stringify(req.body);
        taskJson = JSON.parse(textPayload);
        // isValid = hasExactFields(taskJson, EXPECTED_FIELDS);
        isValid = true
    } catch (error) {
        console.log(error);
        isValid = false;
    }

    if (isValid) {
        console.log(taskJson);
        
        if (taskJson.delete){
            deleteSubTask(taskJson.delete)
        }

        else{
            subtask = {
                task_id:req.params.uid,
                title: taskJson.title
            }
    
            addSubTask(subtask);
        }

        res.redirect('/tasks')

    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + EXPECTED_FIELDS,
            "data": textPayload
        });
    }


});

// ========= EXPORTS
module.exports = router;
