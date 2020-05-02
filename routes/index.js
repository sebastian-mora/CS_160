var express = require('express');
var cookieParser = require('cookie-parser');

var router = express.Router();
router.use(cookieParser());

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/login')
  // res.render('pages/index.ejs')
});


router.get('/logout', function(req, res) {
  res.cookie('userid', '999', {maxAge: Date.now()}); 
  res.redirect('/login')
  // /res.render('pages/index.ejs')
});

module.exports = router;
