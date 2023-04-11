var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./pages/index');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('./pages/register');
});

/* GET home client */
router.get('/homeClient', function(req, res, next) {
  res.render('./pages/homeClient');
});

module.exports = router;