/**@dandreavh */
const auth = {};

// check if the user is authenticated
auth.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Necesita tener la sesión iniciada');
    res.redirect('../');
};

module.exports = auth;