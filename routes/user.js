var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res) {
  // Needs logic
  console.log("HIT");
  
  res.redirect('/login')
});

module.exports = router;
