const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // model to use
const Pet = require('../models/Pet'); // model to use
const db = mongoose.connection;

/* 
______________________________________________________________________

-------------------------- API for users -----------------------------
______________________________________________________________________
*/

module.exports = router;