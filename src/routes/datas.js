const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const { check, validationResult } = require('express-validator');
const {isAuthenticated} = require('../controller/authenticate');
const Chart = require('chart.js');
// model to use
const Pet = require('../models/Pet');
const User = require('../models/User'); 
const Reservation = require('../models/Reservation');

/* 
______________________________________________________________________

----------------------- API for graphics --------------------------
______________________________________________________________________
*/

router.get('/economy', isAuthenticated, 
    async (req, res) => {
        console.log("In get removePet");
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            req.flash('error_msg', 'Ha habido un error al encontrar tu mascota');
        } else{
            if (pet.status === "active") {
                res.render('./pages/removePet', {pet});
            } else{
                req.flash('error_msg', 'Esta mascota ya no se puede eliminar');
                res.redirect('/home');
            }
        }
    }
);

module.exports = router;