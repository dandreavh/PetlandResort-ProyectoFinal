const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const passport = require('passport');
const {isAuthenticated} = require('../controller/authenticate');
const { check, validationResult } = require('express-validator');
// models to use
const User = require('../models/User'); 
const Pet = require('../models/Pet');


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
      await User.create(req.body);
      req.flash('success_msg', 'Usuario registrado con éxito');
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
    if (!errors.isEmpty()) {
        console.log(errors);
        for (const error of errors.array()) {
            req.flash('error_msg','\n'+ error.msg + '\n');
        }
        return res.redirect('/users/editUser');
    }
    const userLogged = req.user;
    console.log(userLogged);
    await User.findOneAndUpdate({'username': userLogged.username}, req.body)
    req.flash('success_msg', 'Tu perfil se ha modificado con éxito'); 
    res.redirect('/home');
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