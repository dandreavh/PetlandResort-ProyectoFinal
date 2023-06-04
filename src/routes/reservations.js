const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// models to use
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

router.get('/addReservation', isAuthenticated, async (req, res) => {
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    res.render('./pages/addReservation', {petsList});
})

// POST to create a new reservation (General)
router.post('/addReservation', isAuthenticated, async function(req, res) {
    console.log("In addReservation");
    if(isAuthenticated){
        const userLogged = req.user;
        if(userLogged.role === "client"){

        } else{
            
        }
        console.log("--------------------" + req.body.pets);
        const newReservation = await Reservation.create(req.body);
        console.log(newReservation);
        req.flash('success_msg', 'Reserva realizada con éxito'); 
    } else{
        req.flash('error_msg', 'Ha habido un error al realizar la reserva');
    }
    res.redirect('../home');
});

module.exports = router;