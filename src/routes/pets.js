const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('../models/Pet');
// model to use
const User = require('../models/User'); 
const Reservation = require('../models/Reservation');
const {isAuthenticated} = require('../controller/authenticate');
const db = mongoose.connection;

/* 
______________________________________________________________________

----------------------- API for pets--------------------------
______________________________________________________________________
*/

// GET all the users order by registration date
router.get('/', isAuthenticated, async (req, res) =>{
    const pets = await Pet.find().sort('-register_date');
    if(!pets) res.status(500).json({success:false});
    res.send(pets);
});

// --------------------- REGISTER PETS -----------------------------
router.get('/addPet', isAuthenticated, async (req, res) => {
    res.render('./pages/addPet');
})

// POST to create a new pet (General) <REVISAR>
router.post('/addPet', async (req, res) => {
    console.log("In addPet");
    const caregiver = req.user.username;
    const checkPet = await Pet.find({'chip': req.body.chip});
    if(checkPet !== null){
        const newPet = await Pet.create(req.body);
        await Pet.findByIdAndUpdate(
            {'_id': newPet.id}, 
            {'caregiver' : caregiver});
        await User.findOneAndUpdate(
            {'username': caregiver}, 
            {$push:{pets:newPet}});
        req.flash('success_msg', 'Mascota añadida con éxito');
        res.redirect('../home');
    } else{
        req.flash('error_msg', 'La mascota con ese chip ya existe');
        res.redirect('/addPet');
    }
});

// --------------------- EDIT PETS -----------------------------
// GET to redirect to editPet put
router.get('/editPet/:id', isAuthenticated, 
    async (req, res) => {
        console.log("In get editPet");
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            req.flash('error_msg', 'Ha habido un error al encontrar tu mascota');
        } else{
            if (pet.status === "active") {
                res.render('./pages/editPet', {pet});
            } else{
                req.flash('error_msg', 'Esta mascota ya no se puede modificar');
                res.redirect('/home');
            }
        }
    }
);

// PUT to update pets and redirect back to home page with message
router.put('/editPet/:id', isAuthenticated, 
    [// validations
    ],
    async (req, res) => {
        console.log("In put editPet");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/home');
        }

        await Pet.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'Mascota modificada con éxito'); 
        res.redirect('/home');
    }
);

// --------------------- REMOVE PETS -----------------------------
// GET to redirect to removePet put
router.get('/removePet/:id', isAuthenticated, 
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

// PUT to update pets status (inactive)
router.put('/removePet/:id', isAuthenticated, 
    [// validations
    ],
    async (req, res) => {
        console.log("In put removePet");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/home');
        }
        await Pet.findByIdAndUpdate(req.params.id, {'status':'inactive'});
        req.flash('success_msg', 'Mascota eliminada con éxito'); 
        res.redirect('/home');
    }
);

module.exports = router;