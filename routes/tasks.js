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

// ========= ENDPOINTS

/*
--- Fetch a Task ---
Fetch a single task, with nonexistence treated as a 404 error

Syntax:
    GET <host>/tasks/<unique-integer-id>
Example Usage:
    curl -v http://127.0.0.1:3000/tasks
*/
router.get('/:uid', function(req, res) {
    const taskJson = lookupTask(req.params.uid);
    if (!isEmptyObject(taskJson)) {
        res.send({
            "status": "success",
            "message": "Fetched task with uid=" + req.params.uid,
            "data": taskJson
        });
    } else {
        res.status(404).send({
            "status": "error",
            "message": "No task with uid=" + req.params.uid + " found",
            "data": taskJson
        });
    }
});

/*
--- Edit a Task ---
Fetch a single task, with nonexistence treated as a 404 error

Syntax:
    GET <host>/tasks/<unique-integer-id>
Example Usage:
    curl -v http://127.0.0.1:3000/tasks
*/
router.post('/:uid', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    const expectedFields = ['date_due', 'title', 'description', 'tags', 'priority', 'status'];
    var isValid, textPayload, taskJson;

    try {
        textPayload = JSON.stringify(req.body);
        taskJson = JSON.parse(textPayload);
        isValid = hasExactFields(taskJson, expectedFields);
    } catch (error) {
        console.log(error);
        isValid = false;
    }

    if (isValid) {
        addTask(taskJson);
        res.send({
            "status": "success",
            "message": "Created task with fields: " + expectedFields,
            "data": textPayload
        });

    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + expectedFields,
            "data": textPayload
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
    const taskJsons = lookupTasks(getEpochDate(), getCurrentDate());
    const message =  "Fetched ALL " + taskJsons.length + " task(s)";
    // res.send({
    //     "status": "success",
    //     "data": taskJsons,
    //     "message": "Fetched ALL " + taskJsons.length + " task(s)"
    // });
    res.render('pages/index.ejs', {tasks:taskJsons});
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

/*
--- Create/Delete/Update Task ---
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
        "date_created": "2020-02-24T15:16:30.000Z",
        "date_due": "2020-02-25T15:16:30.000Z",
        "title": "TITLE",
        "description": "DETAILS",
        "tags": [],
        "comments": [],
        "subtasks": []
    }'
*/
router.post('/', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    const expectedFields = ['date_due', 'title', 'description', 'tags', 'priority', 'status'];
    var isValid, textPayload, taskJson;

    try {
        textPayload = JSON.stringify(req.body);
        taskJson = JSON.parse(textPayload);
        isValid = hasExactFields(taskJson, expectedFields);
    } catch (error) {
        console.log(error);
        isValid = false;
    }

    if (isValid) {
        addTask(taskJson);
        res.send({
            "status": "success",
            "message": "Created task with fields: " + expectedFields,
            "data": textPayload
        });

    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + expectedFields,
            "data": textPayload
        });
    }
});

// ========= EXPORTS
module.exports = router;
