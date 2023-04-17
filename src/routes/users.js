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
  res.send(users);
});

router.get('/register', (req, res) => {
  res.render("/registerAdmin");
});

router.get('/homeClient', (req, res) => {
  res.render("/homeClient");
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('../');
  });
});

// POST to create a new user (General)
router.post('/register', async function(req, res) {
  console.log("In register");
  const {name, surnames, idnumber, birthday, phone, email, address, username, password, role} = req.body;
  const checkUser = await User.findOne({'username': username});
  if(checkUser){
    await User.create({name, surnames, idnumber, birthday, phone, email, address, username, password, role});
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