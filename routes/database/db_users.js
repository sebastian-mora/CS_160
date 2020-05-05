const pool = require('./connection');


function addUser(firstname, lastname, email, password){

    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.
    var query = `INSERT INTO accounts (email, firstname, lastname, password) VALUES('${email}', '${firstname}', '${lastname}', '${password}');`;

    pool.getConnection(function(error, connection){
      if(error){
          console.log(error);
          return;
      }
      connection.query(query, function(error, result) {
          if (error) {
              console.log("Error in task query");
              console.log(error);
          } else {
              connection.release();
          }
      });
  })

}

function findUser(email, password){

  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query = `SELECT userid FROM accounts WHERE email='${email}' AND password ='${password}'`;

    pool.getConnection(function(error, connection){
      if(error){
          console.log(error);
          return;
      }
      connection.query(query, function(error, rows) {
          if (error) {
              return reject(error);
          }

          if(rows.length >= 1){
            resolve(rows[0].userid)
          }
          resolve(false);

      });   
  });


});

}

module.exports ={
  addUser,
  findUser
}