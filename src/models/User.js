/**@dandreavh */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// To encrypt password
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
// Refered model
const Pet = require('../models/Pet.js');

// Users model
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}}, 
    name: {type: String, required: true}, 
    surnames: {type: String, required: true}, 
    password: {type: String, required: true}, 
    idnumber: {type: String, required: true, index: {unique: true}}, 
    email: {type: String, required: true, index: {unique: true}}, 
    phone: {type: String, required: true}, 
    address: {type: String, required: true}, 
    birthday: {type: Date, required: true}, 
    register_date: {type: Date, default: Date.now, required: true}, 
    avatar: {type: String, default:'/images/avatar-default.png'}, 
    status: {type: String, enum: ['inactive', 'active'], default: 'active'}, 
    role: {type: String, enum: ['client', 'staff', 'admin'], default: 'client'}, 
    // —------------- if role is client: —---------------------------
    pets: [{type: Schema.Types.ObjectId, ref: Pet, default: null}], 
    // —------------- if role is staff: —---------------------------
    position: {
        start_date: {type: Date, default: Date.now}, 
        end_date: {type: Date}, 
        studies: {type: String}, 
        title: {type: String, enum: ['employee', 'manager', ''], default: ''},
        salary: {type: Number, default: 0},
        reportsTo: {type: String, default: ''},
    }
});
// Hashing password
UserSchema.pre('save', function(next) {
    const user = this;
    // evaluates if it has hashed password or is modified
    if (!user.isModified('password')) return next();
    // creates salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // use salt when hashing password
        bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
            // overwrites the password
            user.password = hash;
            next();
        });
    });
});
// Method to compare password (if it's logged properly)
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);