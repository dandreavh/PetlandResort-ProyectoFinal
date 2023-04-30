const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// model to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');
const {isAuthenticated} = require('../controller/authenticate');
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

router.get('/addReservation', async (req, res) => {
    res.render('./pages/addReservation');
})

// POST to create a new user (General)
router.post('/addReservation', isAuthenticated, async function(req, res) {
    console.log("In addReservation");

/*     if(){
        const newPet = await Pet.create(req.body);

        req.flash('success_msg', 'Reserva realizada con éxito');
        res.redirect('../home');
    } else{
        req.flash('error_msg', 'Ha habido un error al realizar la reserva');
        res.redirect('/addPet');
    } */
});

module.exports = router;