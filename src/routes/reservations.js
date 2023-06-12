/**@dandreavh */
const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const { check, validationResult } = require('express-validator');
const {isAuthenticated} = require('../controller/authenticate');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');

/* 
______________________________________________________________________

----------------------- API for reservations--------------------------
______________________________________________________________________
*/
// GET all the reservations ordered by checkin date descending
router.get('/listReservations', isAuthenticated, 
    async (req, res) =>{
        console.log("In get listReservations");
        const reservationsList = await Reservation.find().sort('-checkin');;
        res.render('./pages/allReservations', {reservationsList});
    }
);

// POST to find a unique reservation by id
router.post('/findReservation', isAuthenticated, 
    async (req, res) =>{
        console.log("In get findReservation");
        if(req.user.role === "staff"){
            try {
                const foundReservation = await Reservation.findById(req.body.reservation);
                res.render('./pages/findReservation', {foundReservation});
            } catch (error) {
                req.flash('error_msg', error);
                res.redirect('/home');
            }
        }
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
        check('client')
            .notEmpty().withMessage('El campo "Nombre del titular de la reserva" es obligatorio'),
        check('pets')
            .notEmpty().withMessage('Debes seleccionar al menos una mascota'),
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
            //const userLogged = req.user;
            const {checkin, checkout, client, pets, cares, observations, price} = req.body;
            const roomType = req.body.roomType;
            const reservation  = {
                checkin: checkin,
                checkout: checkout,
                room: {
                    type: roomType,  
                },
                client: client,
                pets: pets,
                cares: cares,
                observations: observations,
                price: price,
            }
            const newReservation = await Reservation.create(reservation);
            console.log(newReservation);

            /* // mail configuration
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
                },
            });
            // define email parameters
            const mailOptions = {
                from: process.env.EMAIL,
                to: userLogged.email,
                subject: 'Petland Resort - Reserva realizada',
                text: 'Estimado/a cliente, adjunto dejamos PDF con los detalles de su reserva. Nos vemos pronto',
                attachments: [
                {
                    filename: `reserva-${newReservation.id}.pdf`,
                    path: `reserva-${newReservation.id}.pdf`,
                },
                ],
            };
            // send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error al enviar el correo:', error);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            }); */
            req.flash('success_msg', 'Reserva realizada con éxito');
        } else{
            req.flash('error_msg', 'Ha habido un error al realizar la reserva');
        }
        res.redirect('../home');
    }
);

// GET to open pdf file in browser
router.get('/generatePDF/:id', isAuthenticated, 
    async (req, res) => {
    if(isAuthenticated){
        const userLogged = req.user;
        const reservation = await Reservation.findById(req.params.id);
        if(reservation){
            const doc = new PDFDocument();
            // Hearders sets
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=pr-${reservation.id}.pdf`);
        
            // Escribe el contenido del PDF en la respuesta HTTP
            doc.pipe(res);
        
            // Agrega el contenido del PDF
            doc.image(path.join(__dirname, '../public/images/1.png'), {
                fit: [150, 150],
            });
            doc.lineGap(30);
            doc.fontSize(30).text('Gracias por elegirnos');
            doc.fontSize(25).text('Detalles de la reserva', { underline: true });
            doc.lineGap(15);
            doc.fontSize(15);
            doc.text(`Id de la reserva: ${reservation.id}`);
            doc.text(`Titular de la reserva: ${userLogged.name} ${userLogged.surnames}`);
            doc.text(`Fecha de entrada: ${reservation.checkin.toLocaleDateString()}`);
            doc.text(`Fecha de salida: ${reservation.checkout.toLocaleDateString()}`);
            doc.text(`Tipo de habitación: ${reservation.room.type}`);
            doc.text(`Observaciones: ${reservation.observations}`);
            doc.text(`Precio: ${reservation.price} €`);
            doc.lineGap(5);
            doc.fontSize(10).font('Helvetica-Oblique').fillColor('gray').text(`* El importe se abonará en el centro al realizar el checkin y puede variar en función de los servicios extra y de si son mascotas más pequeñas`);
        
            // Finaliza y envía el PDF al navegador
            doc.end();
        }
        req.flash('success_msg', 'PDF generado con éxito');
    } else{
        req.flash('error_msg', 'Ha habido un error al generar el PDF');
        res.redirect('../home');
    }
});

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
    /* check('room.type')
    .notEmpty().withMessage('El campo "tipo de habitación" es obligatorio')
    .isIn(['suite', 'pack suite', 'deluxe suite', 'deluxe pack suite']).withMessage('El campo "tipo de habitación" debe ser uno de los valores permitidos'),
     */check('client')
    .notEmpty().withMessage('El campo "Nombre del titular de la reserva" es obligatorio'),
    check('pets')
    .notEmpty().withMessage('Debes seleccionar al menos una mascota'),
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