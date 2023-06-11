/**@dandreavh */
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
// consulting model
const User = require('../models/User');

// verify and log (authentication)
passport.use(new localStrategy({
    // user identifier
    usernameField: 'username',
}, async (username, password, done) => {
    const user = await User.findOne({username: username});
    // check if user exists
    if (!user) return done(null, false, {message: 'Error al iniciar la sesión (User not found)'});
    else{
        // check if password is correct
        await user.comparePassword(password, function(err, isMatch){
            if (isMatch) return done(null, user);
            else return done(null, false, {message: 'Error al iniciar la sesión (Wrong password)'});
        });
    }
}));

// storage id in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// find a user by id and use it
passport.deserializeUser( async (id, done) => {
    try{
        const user = await User.findById(id);
        if(!user) return done(new Error('User not found'));
        done(null, user);
    } catch(e){
        done(e);
    }
});