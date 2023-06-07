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
    const reservations = await Reservation.find().sort('-checkin');;
    res.send(reservations);
});

// GET to render to addReservation (post) with all the pets related to the client
router.get('/addReservation', isAuthenticated, async (req, res) => {
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    res.render('./pages/addReservation', {petsList});
})

router.get('/editReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In editReservation");
    const reservation = await Reservation.findById(req.params.id);
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    if (!reservation) {
        req.flash('error_msg', 'Ha habido un error al encontrar la reserva');
    } else{
        const currentDate = new Date();
        const checkin = new Date(reservation.checkin);
        if (checkin > currentDate) {
            res.render('./pages/editReservation', {reservation, petsList});
        } else{
            req.flash('error_msg', 'Esta reserva no se puede modificar');
            res.redirect('/home');
        }
    }
})



router.put('/editReservation/:id', isAuthenticated, async (req, res) => {
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success_msg', 'Reserva modificada con éxito'); 
    res.redirect('/home');
})

// POST to create a new reservation (General)
router.post('/addReservation', isAuthenticated, async (req, res) => {
    console.log("In addReservation");
    if(isAuthenticated){
        const userLogged = req.user;
        const newReservation = await Reservation.create(req.body);
        req.flash('success_msg', 'Reserva realizada con éxito'); 
    } else{
        req.flash('error_msg', 'Ha habido un error al realizar la reserva');
    }
    res.redirect('../home');
});

// DELETE to remove a reservation if checkin is in a future moment
router.delete('/removeReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In removeReservation");
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        req.flash('error_msg', 'Ha habido un error al encontrar la reserva');
    } else{
        const currentDate = new Date();
        const checkin = new Date(reservation.checkin);
        if (checkin > currentDate) {
            await Reservation.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Reserva eliminada con éxito'); 
        } else {
            req.flash('error_msg', 'Esta reserva no se puede eliminar');
        }
    }
});

module.exports = router;