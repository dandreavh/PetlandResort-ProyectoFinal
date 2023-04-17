const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // model to use
const db = mongoose.connection;
const passport = require('passport');

/* 
______________________________________________________________________

-------------------------- API for users -----------------------------
______________________________________________________________________
*/
// GET all the users order by registration date
router.get('/', async (req, res) =>{
  const users = await User.find().sort('-register_date');
  if(!users) res.status(500).json({success:false});
  res.send(users);
});

router.get('/register', function (req, res) {
  res.render("/registerAdmin");
});

router.get('/homeClient', function (req, res) {
  res.render("/homeClient");
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
/* router.post('/login', function(req, res, next) {
  console.log("In login");
  User.findOne({ username: req.body.username }).then((user) => {
    // Si el usuario existe...
    if (user != null) {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) return next(err);
        // Si el password es correcto...
        if (isMatch){
          res.send({ message:'Bienvenido/a, '+user.name});
        } 
        else res.status(200).send({ message: 'Algún dato es erróneo' });
      });
    };
  });
}); */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '../',
  failureFlash: true
}));

module.exports = router;