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

router.get('/addPet', isAuthenticated, async (req, res) => {
    res.render('./pages/addPet');
})

// POST to create a new user (General)
router.post('/addPet', async function(req, res) {
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

module.exports = router;