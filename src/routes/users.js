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
/* router.get('/', async function(req, res, next) {
  const users = await User.find().sort('-register_date');
  if(res.status(200)){
    res.render('users', {users}); 
  } else{
    console.log("ERROR!!!!!! "+res);
  }
}); */


// POST new user (General)
router.post('/', function(req, res, next) {
  User.create(req.body)
  .then(()=>{
    res.status(200).send({msg:"Usuario creado correctamente"});
  }).catch((err)=>{
    if (err) res.status(500).send(err)
  })
});

module.exports = router;
