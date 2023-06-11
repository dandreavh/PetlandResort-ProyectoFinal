/**@dandreavh */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controller/authenticate');
// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('./pages/index');
});

/* GET home page */
router.get('/home', async (req, res) => {
  try {
    const userLogged = req.user;
    if(isAuthenticated) {
      if(userLogged.role === 'client'){
        const petsList = await Pet.find({'caregiver': userLogged.username});
        const reservationsList = await Reservation.find({'client': userLogged.username});
        res.render('./pages/home',{
          petsList,
          reservationsList
        });
      }
      res.render('./pages/home', {userLogged});
    } else{
      res.render('./pages/');
    }
  } catch (error) {
    res.render('./pages/');
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
    const reservationsList = await Reservation.find({'client': userLogged.username}).sort('-checkin');
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

/* GET statistics page */
router.get('/statistics', isAuthenticated, async (req, res) => {
  try {
    const userLogged = req.user;
    if(isAuthenticated) {
      if(userLogged.role === 'admin'){
        const petsList = await Pet.find({'caregiver': userLogged.username});
        const reservationsList = await Reservation.find({'client': userLogged.username});
        res.render('./pages/statistics',{
          petsList,
          reservationsList
        });
      }
      res.render('./pages/home', {userLogged});
    } else{
      res.render('./pages/');
    }
  } catch (error) {
    res.render('./pages/');
  }
});

module.exports = router;