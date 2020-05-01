var express = require('express');
var router = express.Router();
var userDB = require('./database/db_users')

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('pages/login.ejs')
});

router.post('/', function(req, res) {
  var email = req.body.email;
  var password =req.body.password;

  userDB.findUser(email, password).then( userid =>{
    if(userid){
      console.log("FOUND USER IN ROUTE");
      res.cookie('userid', userid)
      res.redirect('/tasks')
    }
    else{
      res.redirect('/login')
    }
  });
});


/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('pages/register.ejs')
});

module.exports = router;
