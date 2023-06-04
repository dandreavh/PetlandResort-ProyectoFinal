const express = require('express');
const router = express.Router();
// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');
const { isAuthenticated } = require('../controller/authenticate');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('./pages/index');
});

/* GET home page */
router.get('/home', async (req, res) => {
  const userLogged = req.user;

  if(isAuthenticated && userLogged.role === 'client') {
    const petsList = await Pet.find({'caregiver': userLogged.username});
    const reservationsList = await Reservation.find({'client': userLogged.username});
    res.render('./pages/home',{
      petsList,
      reservationsList
    });
  } else{
    res.render('./pages/home');
  }
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  // evaluate if user logged is admin, manager or not
  res.render('./pages/register');
});

/* GET reservations page */
router.get('/reservations', async (req, res) => {
  const userLogged = req.user;
  // check  if user is logged
  console.log(userLogged);
  if(isAuthenticated){
    const petsList = await Pet.find({'caregiver': userLogged.username});
    const reservationsList = await Reservation.find({'client': userLogged.username});
    res.render('./pages/reservations',{
      petsList,
      reservationsList
    });
  } else{
    res.render('./pages/reservations');
  } 
  
});

/* GET rooms page */
router.get('/rooms', function(req, res, next) {
  res.render('./pages/rooms');
});

/* GET services page */
router.get('/services', function(req, res, next) {
  res.render('./pages/services');
});

/* GET about us page */
router.get('/aboutus', function(req, res, next) {
  res.render('./pages/aboutus');
});

module.exports = router;