const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Refered models
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
// Reservations model
const ReservationSchema = new mongoose.Schema({
    checkin: {type: Date, required: true},
	checkout: {type: Date, required: true},
	timestamp: {type: Date, default: Date.now, required: true},
	room: {
		type: {type: String, enum: ['suite', 'pack suite', 'deluxe suite', 'deluxe pack suite'], default: 'suite', required: true},
		assigned: {type: String},
		details: {type: String}		
    },
	client: {type: String, required: true}, 
    pets: [{type: mongoose.Schema.Types.ObjectId, required: true}], 
    cares: {type: String},
    petsitter: [{type: mongoose.Schema.Types.ObjectId}], 
    observations: {type: String}, 
    price: {type: Number},
    status: {type: String, enum: ['pending', 'checked'], default: 'pending', required: true}, 
})

module.exports = mongoose.model('Reservation', ReservationSchema);