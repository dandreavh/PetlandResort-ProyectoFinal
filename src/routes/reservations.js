const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// model to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');
const db = mongoose.connection;

/* 
______________________________________________________________________

----------------------- API for reservations--------------------------
______________________________________________________________________
*/
// GET all the users order by registration date
router.get('/listReservations', async (req, res) =>{
    const reservations = await Reservation.find();
    res.send(reservations);
});

module.exports = router;