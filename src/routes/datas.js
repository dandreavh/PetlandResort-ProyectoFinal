/**@dandreavh */
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

----------------------- Graphics --------------------------
______________________________________________________________________
*/

// GET for graphics - Reservation prices
router.get('/economy', isAuthenticated, 
    async (req, res) => {
        console.log("In get economy");
        // Calculates amount per month in each reservation
        const results = await Reservation.aggregate([
            {
                $group: {
                    _id: { $month: "$checkin" },
                    total: { $sum: "$price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    total: 1
                }
            },
            {
                $sort: {
                    month: 1
                }
            }
        ]).exec();
        console.log(results);
        if (!results) {
            req.flash('error_msg', 'Ha habido un error al encontrar datos');
        } else{
            res.json({ results });
        }
    }
);

// GET for graphics - Room type
router.get('/roomType', isAuthenticated, 
    async (req, res) => {
        console.log("In get roomType");
        const results = await Reservation.aggregate([
            {
                $group: {
                    _id: "$room.type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1
                }
            }
        ]).exec();
        console.log(results);
        if (!results) {
            req.flash('error_msg', 'Ha habido un error al encontrar datos');
        } else{
            res.json({ results });
        }
    }
);

// GET for graphics - Reservations
router.get('/reservations', isAuthenticated, 
    async (req, res) => {
        console.log("In get reservations");
        const results = await Reservation.aggregate([
            {
                $group: {
                    _id: { $month: "$checkin" },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    total: 1
                }
            }
        ]).exec();
        console.log(results);
        if (!results) {
            req.flash('error_msg', 'Ha habido un error al encontrar datos');
        } else{
            res.json({ results });
        }
    }
);

// GET for graphics - Pet specie
router.get('/petSpecie', isAuthenticated, 
    async (req, res) => {
        console.log("In get petSpecie");
        const results = await Pet.aggregate([
            {
                $group: {
                    _id: "$specie",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1
                }
            }
        ]).exec();
        console.log(results);
        if (!results) {
            req.flash('error_msg', 'Ha habido un error al encontrar datos');
        } else{
            res.json({ results });
        }
    }
);

module.exports = router;