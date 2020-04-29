var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('pages/login.ejs')
});

router.post('/', function(req, res) {
  data = req.body['login'];
  user_name = data[0]
  password = data[1]
  
  res.redirect('/tasks')

});

module.exports = router;
