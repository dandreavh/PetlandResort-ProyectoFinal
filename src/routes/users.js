const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // model to use
const db = mongoose.connection;
const passport = require('passport');
const {isAuthenticated} = require('../controller/authenticate');

/* 
______________________________________________________________________

-------------------------- API for users -----------------------------
______________________________________________________________________
*/
// GET all the users order by registration date
router.get('/', isAuthenticated, async (req, res) =>{
  const users = await User.find().sort('-register_date');
  if(!users) res.status(500).json({success:false});
  res.render('./pages/allUsers', {
    users: users
  });
});

router.get('/register', (req, res) => {
  res.render("/register");
});

// ELIMINAR TRAS PRUEBA
/* router.get('/homeClient', (req, res) => {
  res.render("/homeClient");
}); */

// GET to log out user and redirect
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('../');
  });
});

// POST to create a new user (General)
router.post('/register', async function(req, res) {
  console.log("In register");
  const checkUser = await User.find({'username': req.body.username});
  if(checkUser !== null){
    await User.create(req.body);
    req.flash('success_msg', 'Usuario registrado con éxito');
    res.redirect('../');
  } else{
    req.flash('error_msg', 'Nombre de identificación del usuario ya registrado');
    res.redirect('/register');
  }
});

// POST to log-in user
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '../',
  failureFlash: true
}));

module.exports = router;