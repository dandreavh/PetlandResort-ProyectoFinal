const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // model to use
const db = mongoose.connection;

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

// POST to create a new user (General)
router.post('/', function(req, res, next) {
  User
  .create(req.body)
  .then(() => {
    res.status(200).send({msg:"Usuario creado correctamente"});
  })
  .catch((err)=>{
    if (err) res.status(500).send(err);
  })
});

// POST to log-in user
router.post('/login', function(req, res, next) {
  User.findOne({ username: req.body.username }).then((user) => {
    // Si el usuario existe...
    if (user != null) {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) return next(err);
        // Si el password es correcto...
        if (isMatch){
          res.redirect("/homeClient").send({ message:'Bienvenido/a, '+user.name});
        } 
        else res.status(200).send({ message: 'Algún dato es erróneo' });
      });
    };
  });
});

module.exports = router;