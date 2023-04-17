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
    if (!user) return done(null, false, {message: 'User not found'});
    else{
        // check if password is correct
        const match = await User.comparePassword(password, user.password);
        if (match) return done(null, user);
        else return done(null, false, {message: 'Wrong data'});
    }
}));

// storage id in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// find a user by id and use it
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});