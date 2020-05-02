const database = require('./connection');


// todo: add errors, we want the tasks route to be able to report the error in the response message, rather than logging
// here...perhaps errors or a status string, that if not empty indicates the error that occurred?
function addTask(taskJson) {

    let query = `INSERT INTO task (date_due,title,description,priority,status, tag, userid) VALUES( '${taskJson.date_due}', '${taskJson.title}', '${taskJson.description}', '${taskJson.priority}', '${taskJson.status}', '${taskJson.tag}', '${taskJson.userid}')`
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error in task query");
            console.log(error);
        } else {
            console.log("inserted");
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
            // console.log(result);
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
            // console.log(result);
        }
    });
}

function updateTask(uid, taskJson) {
    let query = `UPDATE task SET date_due='${taskJson.date_due}', title='${taskJson.title}', description='${taskJson.description}', priority='${taskJson.priority}', status='${taskJson.status}', tag='${taskJson.tag}' WHERE uid=${uid}`
    database.query(query, function(error, result) {
        if (error) {
            console.log("Error updating task query");
            console.log(error);
        } else {
            // console.log(result);
        }
    });
}

// let query = 
// lookupTask(uid: int) => json | {} if not found
function searchLookup(search, userid){
   
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
  
        var query_str = `SELECT * FROM task WHERE (title LIKE '%${search}%' OR priority LIKE '%${search}%' OR tag LIKE '%${search}%') AND userid=${userid}`;

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

// lookupTasks(userid: int) => list[json] | {} if none in time range
function lookupTasks(userid){

  return new Promise(function(resolve, reject) {
      // The Promise constructor should catch any errors thrown on
      // this tick. Alternately, try/catch and reject(err) on catch.

      var query_str = `SELECT * FROM task WHERE userid=${userid}`;

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



module.exports ={
    addTask,
    addSubTask,
    deleteSubTask,
    searchLookup,
    lookupTasks,
    lookupSubTasks,
    updateTask
}