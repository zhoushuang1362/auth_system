var User_shelter = require('../models/user_shelter');
var User = require('../models/user');
var Shelter = require('../models/shelter');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');

exports.all_user_shelter = function(req,res,next){
    var login_user_id = req.session.user._id;
    var role = req.session.user.role.role_name;
    var shelter_id = req.session.user.shelter;
    if(role=='admin'){
        User_shelter.find({shelter:shelter_id,user:{$ne:[login_user_id]}})
        .populate('user')
        .populate('shelter')
        .exec(function (err,allusershelter){
                if(err){
                    return next(err);
                }else{
                    res.render('all_user_shelter',{title: 'All users in the shelter', all_user_shelter: allusershelter});
                }
            })
    }else{
        User_shelter.find()
        .populate('user')
        .populate('shelter')
        .exec(function (err, allusershelter) {
            if (err) { return next(err); }
            res.render('all_user_shelter', { title: 'All users in shelter', all_user_shelter: allusershelter });
        })
    } 
};