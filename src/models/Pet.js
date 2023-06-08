const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Refered model
const User = require('../models/User.js');
// Pets model
const PetSchema = new mongoose.Schema({
    register_date: {type: Date, default: Date.now, required: true}, 
	name: {type: String, required: true},
    birthday: {type: Date, required: true},
    chip: {type: String},
    specie: {type: String, enum: ['dog', 'cat', 'bird', 'rodent', 'fish', 'other'], default: 'dog', required: true}, 
    breed: {type: String},
    size: {type: String, enum: ['small', 'medium', 'large'], default: 'medium'},
    color: {type: String},
    friendly: {type: Boolean, required: true, default: true},
    avatar: {type: String, default:'/images/2.png'},
    comments: {type: String},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'},
    medical_info: {type: String},
    caregiver: {type: String},
    informs:  [{
        timestamp:  {type: Date, default: Date.now},
        author: {type: mongoose.Schema.Types.ObjectId},
        shift: {type: String, enum: ['morning', 'afternoon', 'night']},
        description: {type: String}
    }]
})

module.exports = mongoose.model('Pet', PetSchema);