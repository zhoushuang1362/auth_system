var Friends_auth = require('../models/friends_auth');
var User = require('../models/user');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');
exports.all_friends_auth = function(req,res,next){
    Friends_auth.find()
        .populate('auth_user')
        .populate('friend')
        .exec(function (err, all_friends_auths) {
            if (err) { return next(err); }
            res.render('all_friends_auths', { title: 'all_friends_auths', all_friends_auth: all_friends_auths });
        })
};

exports.friends_auth_create_get = function(req,res,next){
    const errors = validationResult(req);
     User.findById(req.query.friend_id).exec(function(err,auth_user){
        if(auth_user){
            var friends_auth = new Friends_auth({ 
                auth_user:req.query.auth_user,
                friends:req.session.user,
                date_of_auth: Date.now() 
            });
            if (!errors.isEmpty()) {
                return;
            }
            else {
                Friends_auth.findOne({auth_user:auth_user,friends:req.session.user})
                .exec(function(err, found_friends_auth){
                    if (err) { return next(err); }
                    if(found_friends_auth){
                        res.redirect('/catalog/relationship');
                    }
                    else{
                        friends_auth.save(function (err) {
                            if (err) { return next(err); }
                            if(auth_user.auth_number==2){
                                User.findByIdAndUpdate(req.query.friend_id,{auth_number:auth_user.auth_number+1,is_authenticated:'temp_auth'},function(err){
                                    if (err) { return next(err); }
                                    res.redirect('/catalog/relationship');
                                });
                            }
                            else{
                                User.findByIdAndUpdate(req.query.friend_id,{auth_number:auth_user.auth_number+1},function(err){
                                    if(err){return next(err);}
                                });
                                res.redirect('/catalog/relationship');
                            }
                        });
                    }
                });
            }
        }     
    })
};