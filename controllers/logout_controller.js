var User = require('../models/user');
exports.logout_get= function (req, res) {
    res.redirect('/login');
    delete req.session.user;
};