const database = require('./connection');


function addUser(firstname, lastname, email, password){

    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    var query = `INSERT INTO accounts (email, firstname, lastname, password) VALUES('${email}', '${firstname}', '${lastname}', '${password}');`;

    database.query(query, function(error, result) {
      if (error) {
          console.log("Error in task query");
          console.log(error);
      } else {
          console.log(result);
      }
  });

}

function findUser(email, password){

  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query_str = `SELECT userid FROM accounts WHERE email='${email}' AND password ='${password}'`;

    database.query(query_str, function (err, rows, fields) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            return reject(err);
        }

        if(rows.length >= 1){
          console.log(rows[0].userid); 
          resolve(rows[0].userid)
        }
   
        resolve(false);
    });
});

}

module.exports ={
  addUser,
  findUser
}