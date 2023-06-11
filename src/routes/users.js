/**@dandreavh */
const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const passport = require('passport');
const {isAuthenticated} = require('../controller/authenticate');
const { check, validationResult } = require('express-validator');
// To encrypt password
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');
const Reservation = require('../models/Reservation');


/* 
______________________________________________________________________

-------------------------- API for users -----------------------------
______________________________________________________________________
*/
// GET all the users order by registration date
router.get('/', isAuthenticated, 
  async (req, res) =>{
    try {
      const users = await User.find().sort('-register_date');
      res.render('./pages/allUsers', {users});
    } catch (error) {
      req.flash('error_msg', error);
      res.redirect('/home');
    }
  }
);

// --------------------- REGISTER USERS -----------------------------
// GET to redirect to register post
router.get('/register', (req, res) => {
  res.render("/register");
});

// POST to create a new user (General)
router.post('/register',     
  [// validations
    check('username')
      .notEmpty().withMessage('El nombre de usuario es obligatorio')
      .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    check('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    check('surnames')
      .notEmpty().withMessage('Los apellidos son obligatorios')
      .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    check('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener, al menos, 6 caracteres')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/).withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial'),
    check('idnumber')
      .notEmpty().withMessage('El dni, nie o pasaporte es obligatorio'),
      //.matches(/^(?:\d{8}[A-Z]|[A-Z]\d{7}[A-Z0-9])$/).withMessage('El dni, nie o pasaporte debe tener un formato válido'),
    check('email')
      .notEmpty().withMessage('El correo electrónico es obligatorio')
      .isEmail().withMessage('El correo electrónico no es válido'),
    check('phone')
      .notEmpty().withMessage('El número de teléfono es obligatorio')
      .isLength({ min: 9 }).withMessage('El número de teléfono debe tener, al menos, 9 caracteres'),
    check('address')
      .notEmpty().withMessage('La dirección es obligatoria'),
    check('birthday')
      .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
      .custom((value, { req }) => {
        const birthday = new Date(value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthday.getFullYear();
        if (age < 18) {
          throw new Error('Debes ser mayor de edad para registrarte');
        }
        return true;
      }),
    check('avatar')
      .optional()
      .isURL().withMessage('La URL del avatar no es válida'),
  ],
  async (req, res) => {
    console.log("In register");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        for (const error of errors.array()) {
            req.flash('error_msg','\n'+ error.msg + '\n');
        }
        return res.redirect('/register');
    }
    const checkUser = await User.find({'username': req.body.username});
    if(checkUser !== null){
      try {
        await User.create(req.body);
        req.flash('success_msg', 'Usuario registrado con éxito');
      } catch (error) {
        req.flash('error_msg', 'Error al intentar crear el usuario');
      }
      res.redirect('../');
    } else{
      req.flash('error_msg', 'Nombre de identificación del usuario ya registrado');
      res.redirect('/register');
    }
  }
);

// --------------------- EDIT USERS -----------------------------
// GET to redirect to editUser post
router.get('/editUser', isAuthenticated, 
  async (req, res) => {
    console.log("In get editUser");
    const userLogged = req.user;
    const petsList = await Pet.find({'caregiver': userLogged.username});
    try {
      res.render('./pages/editUser', {petsList});
    } catch (error) {
      req.flash('error_msg', error);
      res.redirect('/home');
    }
  }
);

// PUT to update a reservation and redirect back to home page with message
router.put('/editUser', isAuthenticated, 
  [// validations
/*     check('username')
      .notEmpty().withMessage('El nombre de usuario es obligatorio')
      .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    check('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    check('surnames')
      .notEmpty().withMessage('Los apellidos son obligatorios')
      .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    check('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener, al menos, 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial'),
    check('idnumber')
      .notEmpty().withMessage('El dni, nie o pasaporte es obligatorio')
      .matches(/^(?:\d{8}[A-Z]|[A-Z]\d{7}[A-Z0-9])$/).withMessage('El dni, nie o pasaporte debe tener un formato válido'),
    check('email')
      .notEmpty().withMessage('El correo electrónico es obligatorio')
      .isEmail().withMessage('El correo electrónico no es válido'),
    check('phone')
      .notEmpty().withMessage('El número de teléfono es obligatorio')
      .isLength({ min: 9 }).withMessage('El número de teléfono debe tener, al menos, 9 caracteres'),
    check('address')
      .notEmpty().withMessage('La dirección es obligatoria'),
    check('birthday')
      .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
      .custom((value, { req }) => {
        const birthday = new Date(value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthday.getFullYear();
        if (age < 18) {
          throw new Error('Debes ser mayor de edad para registrarte');
        }
        return true;
      }),
    check('avatar')
      .optional()
      .isURL().withMessage('La URL del avatar no es válida'), */
  ],
  async (req, res) => {
    console.log("In put editUser");
    const errors = validationResult(req);
/*     if (!errors.isEmpty()) {
        console.log(errors);
        for (const error of errors.array()) {
            req.flash('error_msg','\n'+ error.msg + '\n');
        }
        return res.redirect('/users/editUser');
    } */
    const userLogged = req.user;
    console.log(userLogged);
    await User.findOneAndUpdate({'username': userLogged.username}, req.body)
    req.flash('success_msg', 'Tu perfil se ha modificado con éxito'); 
    res.redirect('/home');
  }
);

// --------------------- RESET USERS PASSWORD -----------------------------
// GET to redirect to resetPassword post
router.get('/resetPassword', 
  async (req, res) => {
    console.log("In get resetPassword");
    try {
      res.render('./pages/resetPassword');
    } catch (error) {
      req.flash('error_msg', error);
      res.redirect('/home');
    }
  }
);

// PUT to update password
router.put('/resetPassword', 
  [// validations
  check('newPassword')
  .notEmpty().withMessage('La contraseña es obligatoria')
  .isLength({ min: 6 }).withMessage('La contraseña debe tener, al menos, 6 caracteres'),
  //.matches(/^(?:\d{8}[A-Z]|[A-Z]\d{7}[A-Z0-9])$/).withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial' + '\n'),
  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener, al menos, 6 caracteres')
    //.matches(/^(?:\d{8}[A-Z]|[A-Z]\d{7}[A-Z0-9])$/).withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial'),
  ],
  async (req, res) => {
    console.log("In put resetPassword");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        for (const error of errors.array()) {
            req.flash('error_msg','\n'+ error.msg + '\n');
        }
        return res.redirect('/users/resetPassword');
    }
    const userLogged = req.user;
    if(req.body.newPassword !== req.body.password){
      req.flash('error_msg','No coinciden la contraseña nueva y la confirmación de la misma');
      res.redirect('/users/resetPassword');
    } else {
      if(userLogged){
        const currentUser = await User.findOne({'username': userLogged.username});
        try {
          const passwordChecked = await currentUser.comparePassword(req.body.oldPassword, async function(err, isMatch){
            if (isMatch){
              try {
                const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
                const hash = await bcrypt.hash(req.body.password, salt);
                const updatedUser = await User.findOneAndUpdate(
                  {'username': userLogged.username},
                  {$set: { 'password': hash}}
                ).exec();
                req.flash('success_msg', 'Tu contraseña se ha modificado con éxito');
                res.redirect('/home');
              } catch (err) {
                console.error('Error al actualizar el usuario:', err);
                res.redirect('/users/resetPassword');
              }
            } else{
              req.flash('error_msg','Error al introducir la contraseña actual');
              res.redirect('/users/resetPassword');
              return done(null, false);
            }
          });
        } catch (error) {
          req.flash('error_msg','\n'+ error + '\n');
          res.redirect('/home');
        }
      } else {
        const foundUser = await User.findOne({'username': req.body.username});
        if (!foundUser) {
          req.flash('error_msg','Error al encontrar el usuario');
          res.redirect('/users/resetPassword');
        } else{
          if (foundUser.email !== req.body.email){
            req.flash('error_msg','Error, el correo no coincide con el registrado para este usuario');
            res.redirect('/users/resetPassword');
          } else{
            try {
              const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
              const hash = await bcrypt.hash(req.body.password, salt);
              const updatedUser = await User.findOneAndUpdate(
                {'username': foundUser.username},
                {$set: { 'password': hash}}
              ).exec();
              req.flash('success_msg', 'Tu contraseña se ha modificado con éxito');
              res.redirect('/home');
            } catch (err) {
              console.error('Error al actualizar el usuario:', err);
              res.redirect('/users/resetPassword');
            }
          }
        }
      }
    }
  }
);

// --------------------- REMOVE USER -----------------------------
// GET to redirect to removeUser post
router.get('/removeUser', isAuthenticated,
  async (req, res) => {
    console.log("In get removeUser");
    const userLogged = req.user;
    if(userLogged){
      const petsList = await Pet.find({'caregiver': userLogged.username});
      const reservationsList = await Reservation.find({'client': userLogged.username});
      if(petsList.length > 0 && reservationsList.length > 0) {
        res.render('./pages/removeUser', {userLogged, petsList, reservationsList});
      }
    } else{
      req.flash('error_msg', 'Error al intentar eliminar el usuario');
      res.redirect('/home');
    }
  }
);

// PUT simulating user remove (change status and password)
router.put('/removeUser', isAuthenticated,
  async (req, res) => {
    console.log("In put removeUser");
    const userLogged = req.user;
    if(userLogged){
      await User.findOneAndUpdate({ 'username': userLogged.username }, {
        $set: {
          'status': 'inactive',
          'password': '1234-Eliminado'
        }
      });
      
      const userPets = await Pet.find({ 'username': userLogged.username });
      const petIds = userPets.map(pet => pet.id);
      await Pet.updateMany({ '_id': { $in: petIds } }, { $set: { 'status': 'inactive' } });

      const userReservations = await Reservation.find({ 'client': userLogged.username });
      const reservationIds = userReservations.map(reservation => reservation.id);
      await Reservation.updateMany({ '_id': { $in: reservationIds } }, { $set: { 'status': 'removed' } });
      req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'Usuario eliminado con éxito');
        res.redirect('/');
      });
    } else{
      req.flash('error_msg', 'Error al intentar eliminar el usuario');
      res.redirect('/home');
    }
  }
);

// --------------------- LOGIN/LOGOUT USERS -----------------------------
// GET to log out user and redirect
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('../');
  });
});

// POST to log in user
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/home',
    failureRedirect: '../',
    failureFlash: true
  }
));

module.exports = router;