const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const passport = require('passport');
const {isAuthenticated} = require('../controller/authenticate');
const { check, validationResult } = require('express-validator');

// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');


/* 
______________________________________________________________________

-------------------------- API for users -----------------------------
______________________________________________________________________
*/
// GET all the users order by registration date
router.get('/', isAuthenticated, 
  async (req, res) =>{
    try {
      const users = await User.find().sort('-register_date');
      res.render('./pages/allUsers', {users});
    } catch (error) {
      req.flash('error_msg', error);
      res.redirect('/home');
    }
  }
);

// GET to redirect to editUser post
router.get('/editUser', isAuthenticated, 
  async (req, res) => {
    console.log("In get editUser");
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    try {
      res.render('./pages/editUser', {petsList});
    } catch (error) {
      req.flash('error_msg', error);
      res.redirect('/home');
    }
  }
);

// PUT to update a reservation and redirect back to home page with message
router.put('/editUser', isAuthenticated, 
    [// validations
    
    ],
    async (req, res) => {
        console.log("In put editUser");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/users/editUser');
        }
        const userLogged = req.user;
        console.log(userLogged);
        await User.findOneAndUpdate({'username': userLogged.username}, req.body)
        req.flash('success_msg', 'Tu perfil se ha modificado con éxito'); 
        res.redirect('/home');
    }
);

router.get('/register', (req, res) => {
  res.render("/register");
});

// GET to log out user and redirect
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('../');
  });
});

// POST to create a new user (General)
router.post('/register', async (req, res) => {
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
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/home',
    failureRedirect: '../',
    failureFlash: true
  }
));

module.exports = router;