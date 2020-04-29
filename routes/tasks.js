// ========= IMPORTS
const express = require('express');
const router = express.Router();
const db = require('./database/db_tasks');


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
    
    db.searchLookup(search).then(function(rows) {
        const message =  "Fetched ALL " + rows.length + " task(s)";
        task_data = rows.filter(isOpen)
        
         var loop = new Promise((resolve, reject) => {

            if(task_data.length == 0){resolve()}

             task_data.forEach((task, i) => {
                 task.subtasks = []
                 task.date_created = task.date_created.toLocaleDateString()
                 task.date_due = new Date(task.date_due).toLocaleDateString()

                 
                 db.lookupSubTasks(task.uid).then(function (subrows) {
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
--- Fetch All Tasks ---
Fetches all saved tasks in database, no matter how many

Syntax:
    GET <host>/tasks
Example Usage:
    curl --location --request GET 'http://127.0.0.1:3000/tasks'
*/
router.get('/', function(req, res) {
     db.lookupTasks(getEpochDate(), getCurrentDate()).then(function(rows) {
       const message =  "Fetched ALL " + rows.length + " task(s)";
       task_data = rows.filter(isOpen)
       

        var loop = new Promise((resolve, reject) => {
            if(task_data.length == 0){resolve()}

            task_data.forEach((task, i) => {
                task.subtasks = []
                task.date_created = task.date_created.toLocaleDateString()
                task.date_due = new Date(task.date_due).toLocaleDateString()

                db.lookupSubTasks(task.uid).then(function (subrows) {
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


const EXPECTED_FIELDS = ['date_due', 'title', 'description', 'tag', 'priority', 'status'];
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
        tag:         "",
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
        "tag": "",
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
        db.addTask(taskJson);
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
        tag:         "",
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
        db.updateTask(req.params.uid, taskJson);
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
            db.deleteSubTask(taskJson.delete)
        }

        else{
            subtask = {
                task_id:req.params.uid,
                title: taskJson.title
            }
    
            db.addSubTask(subtask);
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
