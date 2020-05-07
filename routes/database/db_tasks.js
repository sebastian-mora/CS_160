const pool = require('./connection');


// todo: add errors, we want the tasks route to be able to report the error in the response message, rather than logging
// here...perhaps errors or a status string, that if not empty indicates the error that occurred?
function addTask(taskJson) {

    let query = `INSERT INTO task (date_due,title,description,priority,status, tag, userid) VALUES( '${taskJson.date_due}', '${taskJson.title}', '${taskJson.description}', '${taskJson.priority}', '${taskJson.status}', '${taskJson.tag}', '${taskJson.userid}')`
    
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return reject();
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    console.log("Error in task query");
                    console.log(error);
                } else {
                    connection.release();
                    resolve();
                }
            });
        })
    });
}

function addSubTask(subtask){
    let query = `INSERT INTO subtasks (title, task_id, status) VALUES('${subtask.title}', '${subtask.task_id}', 'open')`;

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return reject(error);
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    console.log("Error in task query");
                    console.log(error);
                } else {
                    connection.release();
                    resolve();
                }
            });
        })
    });
}


function deleteSubTask(subtask_id){
    let query = `UPDATE subtasks SET status='closed' WHERE subtask_id='${subtask_id}';`;

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return reject(error);
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    console.log("Error in task query");
                    console.log(error);
                } else {
                    connection.release();
                    resolve();
                }
            });
        })
    });
}

function updateTask(uid, taskJson) {
    let query = `UPDATE task SET date_due='${taskJson.date_due}', title='${taskJson.title}', description='${taskJson.description}', priority='${taskJson.priority}', status='${taskJson.status}', tag='${taskJson.tag}' WHERE uid=${uid}`

    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return reject(error);
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    console.log("Error in task query");
                    console.log(error);
                } else {
                    connection.release();
                    resolve();
                }
            });
        })
    });
}

// let query = 
// lookupTask(uid: int) => json | {} if not found
function searchLookup(search, userid){
   
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
  
        var query = `SELECT * FROM task WHERE (title LIKE '%${search}%' OR priority LIKE '%${search}%' OR tag LIKE '%${search}%') AND userid=${userid}`;

        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return;
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    return reject(error);
                } else {
                    connection.release();
                    resolve(rows);
                }
            });   
        });
        
    });
}

// lookupTasks(userid: int) => list[json] | {} if none in time range
function lookupTasks(userid){

  return new Promise(function(resolve, reject) {
      // The Promise constructor should catch any errors thrown on
      // this tick. Alternately, try/catch and reject(err) on catch.

      var query = `SELECT * FROM task WHERE userid=${userid}`;

      pool.getConnection(function(error, connection){
        if(error){
            console.log(error);
            return;
        }
        connection.query(query, function(error, rows) {
            if (error) {
                return reject(error);
            } else {
                connection.release();
                resolve(rows);
            }
        });   
    })
  });
}


function lookupSubTasks(task_uid){

    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
  
        var query = `SELECT * FROM subtasks WHERE task_id='${task_uid}'`;
  
        pool.getConnection(function(error, connection){
            if(error){
                console.log(error);
                return;
            }
            connection.query(query, function(error, rows) {
                if (error) {
                    return reject(error);
                } else {
                    connection.release();
                    resolve(rows);
                }
            });   
        })
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