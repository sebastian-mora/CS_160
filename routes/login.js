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

  // TODO add check if valid user

  res.redirect('/tasks')

});
/* GET users listing. */
router.get('/register', function(req, res) {
  res.render('pages/register.ejs')
});

module.exports = router;
