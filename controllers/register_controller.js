var mongoose = require('mongoose');
var User = require('../models/user');
var Role = require('../models/role');
var Status = require('../models/status');
var Shelter = require('../models/shelter');
var async = require('async')

const { body, validationResult } = require('express-validator');
exports.register_get = function (req, res) {
    async.parallel({
        shelters: function(callback) {
            Shelter.find(callback);
        },
        status: function(callback) {
            Status.find(callback);
        },
        roles: function(callback) {
          Role.find({role_name:'user'},callback);
      },
      }, function(err, results) {
         if (err) { return next(err); }
         res.render('register', { title: 'register',shelters:results.shelters, status:results.status,roles:results.roles });
         }
      );
};
exports.register_post =  [
    body('family_name', 'family_name required').isLength({ min: 1 }).trim().withMessage('Family_name must be specified.'),
    body('given_name', 'given_name required').isLength({ min: 1 }).trim().withMessage('Given_name must be specified.'),
    body('password').isLength({ min: 1 }).trim().withMessage('password must be specified.'),
    body('birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('sex').isLength({min: 1}).trim().withMessage('sex must be specified'),

    body('age').isLength({min: 1}).trim().withMessage('age must be specified'),
    body('address').isLength({min: 1}).trim().withMessage('address must be specified'),
    body('telephone').isLength({min: 1}).trim().withMessage('telephone must be specified'),
    //note
    body('shelter', 'Shelter must not be empty.').isLength({ min: 1 }).trim(),
    body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),

    body('family_name').escape(),
    body('given_name').escape(),
    body('birth').toDate(),
    body('passwors').escape(),
    body('sex').escape(),
    body('age').escape(),
    body('address').escape(),
    body('telephone').escape(),
    body('note').escape(),
    (req, res, next) => 
    {
        const errors = validationResult(req);
        //const now = Date.now();
        //const birth = req.body.birth;
        //const age1 = now - birth;
        var user = new User(
        { 
            family_name: req.body.family_name,
            given_name: req.body.given_name,
            birth: req.body.birth,
            password:req.body.password,
            sex:req.body.sex,
            age:req.body.age,
            address:req.body.address,
            telephone:req.body.telephone,
            shelter: req.body.shelter,
            status: req.body.status,
            role: req.body.role,
            note:req.body.note,
        }
        );
        if (!errors.isEmpty()) { 
            async.parallel({
                shelters: function(callback) {
                    Shelter.find(callback);
                },
                status: function(callback) {
                    Status.find(callback);
                },
                roles: function(callback) {
                    Role.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('register', { title: 'register',age:age1,shelters:results.shelters, status:results.status, roles: results.roles, errors: errors.array() });
            });
            return;
        }
        else {
           User.findOne({ 'family_name': req.body.family_name ,given_name : req.body.given_name,'telephone': req.body.telephone})
                .exec( function(err, found_user){
                        if (err) { return next(err); }
                        if (found_user) {
                            res.redirect('login' )  
                        }
                        else {
                            user.save(function (err) {
                                if (err) { return next(err); }
                                res.redirect('login');
                            });
                       }
                });
        }
    }
];
