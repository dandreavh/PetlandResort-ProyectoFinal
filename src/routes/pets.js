/**@dandreavh */
const { json } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = mongoose.connection;
const { check, validationResult } = require('express-validator');
const {isAuthenticated} = require('../controller/authenticate');
// to upload files
const multer = require('multer');
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

// POST to find a unique reservation by id
router.post('/findPet', isAuthenticated, 
    async (req, res) =>{
        console.log("In get findPet");
        if(req.user.role === "staff"){
            try {
                const pet = await Pet.findById(req.body.pet);
                res.render('./pages/findPet', {pet});
            } catch (error) {
                req.flash('error_msg', error);
                res.redirect('/home');
            }
        }
    }
);

// --------------------- REGISTER PETS -----------------------------
router.get('/addPet', isAuthenticated, async (req, res) => {
    res.render('./pages/addPet');
})

// POST to create a new pet
router.post('/addPet', async (req, res) => {
    console.log("In addPet");
    let caregiver;
    if(req.user.role === "client"){
        caregiver = req.user.username;
    } else{
        caregiver = req.body.caregiver;
    }
    const checkPet = await Pet.findOne({'chip': req.body.chip});
    if(checkPet){
        req.flash('error_msg', 'La mascota con ese chip ya existe');
        res.redirect('/pets/addPet');
    } else{
        const pet = {
            name: req.body.name,
            birthday: req.body.birthday,
            specie: req.body.specie,
            breed: req.body.breed,
            size: req.body.size,
            color: req.body.color,
            chip: req.body.chip,
            friendly: req.body.friendly,
            medical_info: req.body.medical_info,
            comments: req.body.comments,
            caregiver: caregiver,
        }
        console.log(req.body);
        const newPet = await Pet.create(pet);  
        if(newPet){
            const userUpdated = await User.findOneAndUpdate(
                {'username': caregiver}, 
                {$push:{pets:newPet}}).exec();;
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
const upload = multer({dest: 'uploads/'});
router.put('/editPet/:id', isAuthenticated, upload.single('avatar'),
    [// validations
    ],
    async (req, res) => {
        console.log("In put editPet");
        /*const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            for (const error of errors.array()) {
                req.flash('error_msg','\n'+ error.msg + '\n');
            }
            return res.redirect('/home');
        } */
        // shallow copy 
        const updatedPet = {...req.body};
        if (req.file) {
            const avatarPath = req.file.path;
            updatedPet.avatar = avatarPath.replace('\\', '/');
        }
        await Pet.findByIdAndUpdate(req.params.id, updatedPet);
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