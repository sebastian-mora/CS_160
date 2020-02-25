// ========= IMPORTS
const express = require('express');
const router = express.Router();


// ========= UTILITIES
// lookupTask(uid: int) => json | {} if not found
function lookupTask(uid) {
    // todo: replace dummy data with actual lookup result (as json assembled from sql query)
    if (uid < 0) {
        return {}
    }
    return {
        'uid': uid,
        'date_created': '2020-02-24 15:16:30',
        'date_due':     '2020-02-25 15:16:30',
        'title':        'my dummy task title',
        'description':  'my dummy description',
        'tags':     [],
        'comments': [],
        'subtasks': []
    }
}


// ========= ENDPOINT: FETCHING TASKS
// todo: perhaps this should return all tasks? or we have filtering parameters
// or maybe this should be done elsewhere
router.get('/', function(req, res) {
    res.send("requested task with no id");
});

// can test like `curl -v http://127.0.0.1:3000/tasks/6`
router.get('/:uid', function(req, res) {
    const taskJson = lookupTask(req.params.uid);
    if (taskJson === {}) {
        res.status(404).send('Task with uid=' + req.params.uid + "does not exist");
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
