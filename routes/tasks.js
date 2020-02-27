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

function isEmptyObject(obj) {
    return obj === null ||
        obj === undefined ||
        Array.isArray(obj) ||
        typeof obj !== 'object' || Object.getOwnPropertyNames(obj).length === 0;
}


// ========= DATABASE
// note: as these are internal methods, they assume valid input

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
router.use(express.json());
router.post('/', function(req, res) {
    console.log(request.body);
    response.send(request.body);
});

// ========= EXPORTS
module.exports = router;
