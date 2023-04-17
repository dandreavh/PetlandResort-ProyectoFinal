const auth = {};

// check if the user is authenticated
auth.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Not authenticated');
    res.redirect('../');
};

module.exports = auth;