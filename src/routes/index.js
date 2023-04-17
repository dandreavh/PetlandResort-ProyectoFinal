const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./pages/index');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  // evaluate if user logged is admin, manager or not
  res.render('./pages/registerAdmin');
});

/* GET reservarions page */
router.get('/reservations', function(req, res, next) {
  // check  if user is logged 
  res.render('./pages/reservations');
});

/* GET rooms page */
router.get('/rooms', function(req, res, next) {
  res.render('./pages/rooms');
});

/* GET about us page */
router.get('/aboutus', function(req, res, next) {
  res.render('./pages/aboutus');
});

module.exports = router;