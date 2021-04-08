var Role = require('../models/role');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');
exports.all_roles = function(req,res,next){
    Role.find()
        .sort([['role_name', 'ascending']])
        .exec(function (err, allroles) {
            if (err) { return next(err); }
            res.render('all_roles', { title: 'All roles', all_roles: allroles });
        })
};



