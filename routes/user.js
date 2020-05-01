var express = require('express');
var router = express.Router();
var userDB = require('./database/db_users')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/', function(req, res) {


});


router.post('/register', function(req, res) {


  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password =req.body.password;

  userDB.addUser(firstname, lastname, email, password);
  
  res.redirect('/')

});



module.exports = router;
