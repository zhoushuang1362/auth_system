var mongoose = require('mongoose');
var User = require('../models/user');
var User_shelter = require('../models/user_shelter');
var acl = require('acl');
const { body, validationResult } = require('express-validator');
exports.login_get= function (req, res) {
    res.render('login', { title: 'Login' });
};
exports.login_post =  [
    (req, res, next) => 
    {
        const errors = validationResult(req);
        console.log(req.body.telephone);
        console.log(req.body.password);
        if (!errors.isEmpty()) {
            res.redirect('/login');
            return;
        }else {
            User.findOne({'telephone': req.body.telephone})
            .populate('role')
            .exec(function(err, found_user){
                if (err) { return next(err); }
                if (!found_user) {
                    res.render('login',{title:'未注册'})              
                }else{
                    console.log(found_user.password);
                    if(found_user.password==req.body.password){
                        req.session.user = found_user; // 用户存入session中
                        var login_time = req._startTime;
                        var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db,'_acl'));
                        nodeAcl.addUserRoles(found_user.id,found_user.role.role_name);
                        const errors = validationResult(req);
                        var user_shelter = new User_shelter({
                            user : found_user._id,
                            shelter :found_user.shelter,
                            date : login_time,
                            is_enter : true,
                        });
                        if (!errors.isEmpty()) {
                            res.redirect('login');
                            return;
                        }else{
                            user_shelter.save(function (err){
                                if (err) { 
                                    return next(err); 
                                }else{
                                    res.redirect('/catalog');
                                }
                            });
                        }
                    }else{
                        res.render('login',{title:'密码错误'})
                    };
                }   
            });
        }            
    }
];
