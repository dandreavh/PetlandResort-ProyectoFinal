const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
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
router.get('/listReservations', 
    async (req, res) =>{
        console.log("In get listReservations");
        const reservations = await Reservation.find().sort('-checkin');;
        res.send(reservations);
    }
);

// --------------------- ADD RESERVATIONS -----------------------------
// GET to render to addReservation (post) with all the pets related to the client
router.get('/addReservation', isAuthenticated, 
    async (req, res) => {
        console.log("In get addReservation");
        const userLogged = req.user;
        const petsList = await Pet.find({'caregiver': userLogged.username});
        res.render('./pages/addReservation', {petsList});
    }
);

// POST to create a new reservation
router.post('/addReservation', isAuthenticated, 
    [// validations
        check('checkin')
            .notEmpty().withMessage('El campo "fecha de entrada" es obligatorio')
            .isDate().withMessage('El campo "fecha de entrada" debe ser una fecha válida')
            .custom((value, { req }) => {
                const checkin = new Date(value);
                const currentDate = new Date();
                if (checkin < currentDate) {
                    throw new Error('La fecha de entrada debe ser igual o posterior a la fecha actual');
                }
                return true;
            }),
        check('checkout')
            .notEmpty().withMessage('El campo "fecha de salida" es obligatorio')
            .isDate().withMessage('El campo "fecha de salida" debe ser una fecha válida')
            .custom((value, { req }) => {
                const checkout = new Date(value);
                const checkinDate = new Date(req.body.checkin);
                if (checkout <= checkinDate) {
                    throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
                }
                return true;
            }),
        /*  check('room.type')
            .notEmpty().withMessage('El campo "tipo de habitación" es obligatorio')
            .isIn(['suite', 'pack suite', 'deluxe suite', 'deluxe pack suite']).withMessage('El campo "tipo de habitación" debe ser uno de los valores permitidos'), */
        check('client')
            .notEmpty().withMessage('El campo "Nombre del titular de la reserva" es obligatorio'),
        check('pets')
            .isArray({ min: 1 }).withMessage('Debes seleccionar al menos una mascota'),
    ], 
    async (req, res) => {
        console.log("In post addReservation");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/reservations/addReservation');
        }

        if(isAuthenticated){
            const userLogged = req.user;
            const newReservation = await Reservation.create(req.body);
            req.flash('success_msg', 'Reserva realizada con éxito'); 
        } else{
            req.flash('error_msg', 'Ha habido un error al realizar la reserva');
        }
        res.redirect('../home');
    }
);

// --------------------- EDIT RESERVATIONS -----------------------------
// GET to render to editReservation form with parameters
router.get('/editReservation/:id', isAuthenticated, 
    async (req, res) => {
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
    }
);

// PUT to update a reservation and redirect back to home page with message
router.put('/editReservation/:id', isAuthenticated, 
    [// validations
    check('checkin')
    .notEmpty().withMessage('El campo "fecha de entrada" es obligatorio')
    .isDate().withMessage('El campo "fecha de entrada" debe ser una fecha válida')
    .custom((value, { req }) => {
        const checkin = new Date(value);
        const currentDate = new Date();
        if (checkin < currentDate) {
            throw new Error('La fecha de entrada debe ser igual o posterior a la fecha actual');
        }
        return true;
    }),
    check('checkout')
    .notEmpty().withMessage('El campo "fecha de salida" es obligatorio')
    .isDate().withMessage('El campo "fecha de salida" debe ser una fecha válida')
    .custom((value, { req }) => {
        const checkout = new Date(value);
        const checkinDate = new Date(req.body.checkin);
        if (checkout <= checkinDate) {
            throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
        }
        return true;
    }),
    check('room.type')
    .notEmpty().withMessage('El campo "tipo de habitación" es obligatorio')
    .isIn(['suite', 'pack suite', 'deluxe suite', 'deluxe pack suite']).withMessage('El campo "tipo de habitación" debe ser uno de los valores permitidos'),
    check('client')
    .notEmpty().withMessage('El campo "Nombre del titular de la reserva" es obligatorio'),
    check('pets')
    .isArray({ min: 1 }).withMessage('Debes seleccionar al menos una mascota'),
    ],
    async (req, res) => {
        console.log("In put editReservation");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/reservations/addReservation');
        }

        await Reservation.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'Reserva modificada con éxito'); 
        res.redirect('/home');
    }
);

// --------------------- REMOVE RESERVATIONS -----------------------------
// GET to render to removeReservation if it's possible, sending the reservation document
router.get('/removeReservation/:id', isAuthenticated, 
    async (req, res) => {
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
    }
);

// DELETE to remove a reservation if checkin is in a future moment
router.delete('/removeReservation/:id', isAuthenticated, 
    async (req, res) => {
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
    }
);

module.exports = router;