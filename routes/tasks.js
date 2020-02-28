// ========= IMPORTS
const express = require('express');
const router = express.Router();


// ========= UTILITIES
// isValidDatetimeStringRange(2011-10-05T14:48:00.000Z, 2011-11-05T14:48:00.000Z) => true
// isValidDatetimeStringRange(2011-10-05, 2011-11-05T14:48:00.000Z) => false
// isValidDatetimeStringRange(2011-10-05T14:48:00.000Z, 2001-11-05T14:48:00.000Z) => false
function isValidDatetimeStringRange(from, to) {
    const start = new Date(from);
    const end = new Date(to);
    return start.getTime() < end.getTime() && from === start.toISOString() && to === end.toISOString();
}

// hasAllProperties(obj: object, fieldNames: array[string]) => bool
// hasAllProperties({'foo': 1, 'bar': 2}, ...['foo', 'bar']) => true
function hasAllProperties(obj, fieldNames) {
    for (var i = 0; i < fieldNames.length; i++) {
        if (!obj.hasOwnProperty(fieldNames[i])) {
            console.log("missing field: " + fieldNames[i]);
            return false;
        }
    }
    return true;
}

function isEmptyObject(obj) {
    return obj === null ||
        obj === undefined ||
        Array.isArray(obj) ||
        typeof obj !== 'object' || Object.getOwnPropertyNames(obj).length === 0;
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
        'uid': uid,
        'date_created': '2020-02-24T15:16:30.000Z',
        'date_due':     '2020-02-25T15:16:30.000Z',
        'title':        'my dummy task title',
        'description':  'my dummy description',
        'priority': 'high',
        'tags':     [],
        'comments': [],
        'subtasks': []
    };
}

// lookupTasks({createdAfter: iso8601-datetime-string, createdBefore: iso8601-datetime-string}) => list[json]
// example usage: `lookupTasks()`, `lookupTasks({createdAfter='2020-02-24T15:16:30Z'})`
function lookupTasks(createdAfter, createdBefore) {
    // todo: replace dummy data with actual lookup result (as json assembled from sql query)
    return [lookupTask(10)];
}


// ========= ENDPOINT: FETCHING TASKS
// todo: feels a little dangerous returning ALL tasks, so add some filters like `created_after`
router.get('/', function(req, res) {
    // todo: parse optional request parameters for filtering, and use `isValidDatetimeStringRange()`
    const tasksJson = lookupTasks();
    res.send(tasksJson);
});

// can test like `curl -v http://127.0.0.1:3000/tasks/6`
router.get('/:uid', function(req, res) {
    const taskJson = lookupTask(req.params.uid);
    if (isEmptyObject(taskJson)) {
        res.status(404).send('Task with uid=' + req.params.uid + " does not exist");
    } else {
        res.send(taskJson);
    }
});


// ========= ENDPOINT: CREATING TASK
// can test like:
// curl -X POST http://127.0.0.1:3000/tasks -H 'Accept:application/json' -d "{'date_created':'2020-02-24 15:16:30','date_due':'2020-02-25 15:16:30','title':'TITLE','description':'DETAILS','tags':[],'comments':[],'subtasks':[]}"
router.use(express.json());
router.post('/', function(req, res) {
    // todo: find a better place to put the field names...well actually maybe it is okay here?...
    // maybe specify what field doesn't match in error message, etc?
    if (!hasAllProperties(req.body, ['date_created', 'date_due', 'title', 'description', 'tags', 'comments', 'subtasks'])) {
        res.status(400).send('Task field names do not match expected');
    } else {
        console.log(req.body);
        res.send(req.body);
    }
});

// ========= EXPORTS
module.exports = router;
