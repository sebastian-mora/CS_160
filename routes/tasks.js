// ========= IMPORTS
const express = require('express');
const router = express.Router();


// ========= UTILITIES
// note: all functions use datetimes STRICTLY of the format '2011-10-05T14:48:00.000Z'

function getCurrentDate()   { return new Date(); }
function getEpochDate()     { return new Date(0); }
function isString(text)     { return typeof text === 'string' || text instanceof String; }
function isDate(date)       { return typeof date && date instanceof Date; }

function isValidISODateString(text) {
    const date = new Date(text);
    return isString(text) && isDate(date) && text === date.toISOString();
}
// throwErrorIfInvalidJSON(jsonText: string) => bool
function isValidJSON(jsonText) {
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}
function hasSameNumKeys(obj1, obj2) {
    return Object.keys(obj1).length === Object.keys(obj1).length;
}
function isEmptyObject(obj) {
    return obj === null ||
        obj === undefined ||
        Array.isArray(obj) ||
        typeof obj !== 'object' || Object.getOwnPropertyNames(obj).length === 0;
}
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


// ========= DATABASE
// note: as these are internal methods, they assume valid input

// addTask(taskJson: json) => bool
function addTask(taskJson) {
    // todo: replace with actual database write
    return true;
}

// lookupTask(uid: int) => json | {} if not found
function lookupTask(uid) {
    // todo: replace dummy data with actual lookup result (as json assembled from sql query)
    if (uid < 0) {
        return {};
    }
    return {
        "uid": uid,
        "date_created": "2020-02-24T15:16:30.000Z",
        "date_due":     "2020-02-25T15:16:30.000Z",
        "title":        "my dummy task title",
        "description":  "my dummy description",
        "priority": "high",
        "tags":     [],
        "comments": [],
        "subtasks": []
    };
}

// lookupTasks(createdAfter: date, createdBefore: date) => list[json] | {} if none in time range
function lookupTasks(createdAfter, createdBefore) {
    // todo: replace dummy data with actual lookup result (as json assembled from sql query)
    return [lookupTask(6)];
}


// ========= ENDPOINTS

/*
--- Fetch ONE task ---
GET <host>/tasks/
    <unique-integer-id>

Notes:
* Fetch a single task, with nonexistence treated as a 404 error
* Eg: curl -v http://127.0.0.1:3000/tasks
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
--- Fetch ALL tasks ---
syntax: GET <host>/tasks

Notes:
* Fetches ALL the saved tasks in the database, no matter how large in numerous
* Eg: curl -v http://127.0.0.1:3000/tasks
*/
router.get('/', function(req, res) {
    const taskJsons = lookupTasks(getEpochDate(), getCurrentDate());
    res.send({
        "status": "success",
        "data": taskJsons,
        "message": "Fetched ALL " + taskJsons.length + " task(s)"
    });
});

/*
--- Fetch tasks WITHIN dates ---
GET <host>/tasks?
    created_after=<iso-datetime>&created_before=<iso-datetime>

Notes:
* Fetches all the tasks within given (inclusive) dates
* Eg: curl -v 'http://127.0.0.1:3000/tasks?created_after=2020-02-24T15:16:30.000Z&created_before=2020-02-28T15:16:30.000Z'
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
--- Creating a new task ---
POST <host>/tasks
    @body={
        date_created: <iso-datetime>,
        date_due:     <iso-datetime>,
        title:        <string>,
        description:  <string>,
        tags:         <array[string]>,
        comments:     <array[string]>,
        subtasks:     <array[string]>
    }

Notes:
* Creates a new task, with a uid that is decided upon writing to the database
* Eg: curl -v http://127.0.0.1:3000/tasks -H 'Accept:application/json' -d '{\"date_created\":\"2020-02-24T15:16:30.000Z\",\"date_due\":\"2020-02-25T15:16:30.000Z\",\"title\":\"TITLE\",\"description\":\"DETAILS\",\"tags\":[],\"comments\":[],\"subtasks\":[]}'
*/
router.post('/', function(req, res) {
    // todo: add more validation, as of course we only want good data entering the database
    const expectedFields = ['date_created', 'date_due', 'title', 'description', 'tags', 'comments', 'subtasks'];
    var isValid = true;
    var jsonText, jsonObj;
    try {
        jsonText = JSON.stringify(req.body);
        jsonObj = JSON.parse(jsonText);
        isValid = hasExactFields(jsonObj, expectedFields);
    } catch (error) {
        isValid = false;
    }

    if (isValid) {
        addTask(jsonObj);
        res.send({
            "status": "success",
            "message": "Created task with fields: " + expectedFields,
            "data": jsonText
        });
    } else {
        res.status(400).send({
            "status": "error",
            "message": "Expected exact fields: " + expectedFields,
            "data": jsonText
        });
    }
});

// ========= EXPORTS
module.exports = router;
