const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const { check, validationResult } = require('express-validator');
const {isAuthenticated} = require('../controller/authenticate');
// model to use
const Pet = require('../models/Pet');
const User = require('../models/User'); 
const Reservation = require('../models/Reservation');


/* 
______________________________________________________________________

----------------------- API for pets--------------------------
______________________________________________________________________
*/

// GET all the users order by registration date
router.get('/', isAuthenticated, async (req, res) =>{
    const petsList = await Pet.find().sort('-register_date');
    if(!petsList) res.status(500).json({success:false});
    res.render('./pages/allPets', {petsList});
});

// --------------------- REGISTER PETS -----------------------------
router.get('/addPet', isAuthenticated, async (req, res) => {
    res.render('./pages/addPet');
})

// POST to create a new pet
router.post('/addPet', async (req, res) => {
    console.log("In addPet");
    const caregiver = req.user.username;
    const checkPet = await Pet.findOne({'chip': req.body.chip});
    if(checkPet){
        req.flash('error_msg', 'La mascota con ese chip ya existe');
        res.redirect('/pets/addPet');
    } else{
        const newPet = await Pet.create(req.body);  
        if(newPet){
            const foundNewPet = await Pet.findByIdAndUpdate(
                newPet.id,
                {$set: {caregiver: caregiver}}).exec();;
            if(foundNewPet){
                const userUpdated = await User.findOneAndUpdate(
                    {'username': caregiver}, 
                    {$push:{pets:foundNewPet}}).exec();;
            }
        }
        req.flash('success_msg', 'Mascota añadida con éxito');
        res.redirect('/home');
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
/*         const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/home');
        } */
        await Pet.findByIdAndUpdate(req.params.id, {'status':'inactive'});
        req.flash('success_msg', 'Mascota eliminada con éxito'); 
        res.redirect('/home');
    }
);

module.exports = router;