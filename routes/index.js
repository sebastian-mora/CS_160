var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('views/pages/index.ejs')
});

module.exports = router;
