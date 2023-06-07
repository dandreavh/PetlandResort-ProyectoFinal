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
// GET all the reservations ordered by checkin date descending
router.get('/listReservations', async (req, res) =>{
    console.log("In get listReservations");
    const reservations = await Reservation.find().sort('-checkin');;
    res.send(reservations);
});

// --------------------- ADD RESERVATIONS -----------------------------
// GET to render to addReservation (post) with all the pets related to the client
router.get('/addReservation', isAuthenticated, async (req, res) => {
    console.log("In get addReservation");
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    res.render('./pages/addReservation', {petsList});
});

// POST to create a new reservation
router.post('/addReservation', isAuthenticated, async (req, res) => {
    console.log("In post addReservation");
    if(isAuthenticated){
        const userLogged = req.user;
        const newReservation = await Reservation.create(req.body);
        req.flash('success_msg', 'Reserva realizada con éxito'); 
    } else{
        req.flash('error_msg', 'Ha habido un error al realizar la reserva');
    }
    res.redirect('../home');
});

// --------------------- EDIT RESERVATIONS -----------------------------
// GET to render to editReservation form with parameters
router.get('/editReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In get editReservation");
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
});

// PUT to update a reservation and redirect back to home page with message
router.put('/editReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In put editReservation");
    await Reservation.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success_msg', 'Reserva modificada con éxito'); 
    res.redirect('/home');
});

// --------------------- REMOVE RESERVATIONS -----------------------------
// GET to render to removeReservation if it's possible, sending the reservation document
router.get('/removeReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In get removeReservation");
    const reservation = await Reservation.findById(req.params.id);
    const userLogged = req.user;
    if (!reservation) {
        req.flash('error_msg', 'Ha habido un error al encontrar la reserva');
    } else{
        const currentDate = new Date();
        const checkin = new Date(reservation.checkin);
        if (checkin > currentDate) {
            res.render('./pages/removeReservation', {reservation});
        } else{
            req.flash('error_msg', 'Esta reserva no se puede eliminar');
            res.redirect('/home');
        }
    }
});

// DELETE to remove a reservation if checkin is in a future moment
router.delete('/removeReservation/:id', isAuthenticated, async (req, res) => {
    console.log("In delete removeReservation");
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
    res.redirect('/home');
});

module.exports = router;