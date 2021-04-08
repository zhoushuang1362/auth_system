var mongoose = require('mongoose');
var User = require('../models/user');
var Role = require('../models/role');
var Status = require('../models/status');
var Shelter = require('../models/shelter');
var async = require('async');
var formidable = require('formidable');
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var path = require('path');
var qr = require('qr-image');
const { body, validationResult } = require('express-validator');


exports.index = function(req, res) {
        res.render('index', { title: 'Shelter Manager Home',user: req.session.user });
};

// Display list of all users.
exports.all_users = function(req,res,next){
    var role = req.session.user.role.role_name;
    var shelter_id = req.session.user.shelter;
    var login_user_id = req.session.user._id;
    if(role=='super'){
        //不显示super
        User.find({_id:{$ne:[login_user_id]}})
        .populate('shelter')
        .populate('status')
        .populate('role')
        .sort([['family_name', 'ascending']])
        .exec(function (err, allusers) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('all_users', { title: 'All users in all shelter', all_users: allusers });
        })
    }else
    if(role=='admin'){
        User.find({shelter:shelter_id})
        .populate('shelter')
        .populate('status')
        .populate('role')
        .sort([['family_name', 'ascending']])
        .exec(function (err, allusers) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('all_users', { title: 'All users in the shelter', all_users: allusers });
        })
    }else{
        User.find()
        .populate('shelter')
        .populate('status')
        .populate('role')
        .sort([['family_name', 'ascending']])
        .exec(function (err, allusers) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('all_users', { title: 'All users in all shelter', all_users: allusers });
        })
    }
    
};

exports.user_detail = function(req, res,next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        user: function (callback) {
            User.findById(id)
                .populate('shelter')
                .populate('status')
                .populate('role')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.user == null) { 
            var err = new Error('user not found');
            err.status = 404;
            return next(err);
        }
        res.render('user_detail', { title: 'User Detail', user: results.user });
    });
};

// Display user create form on GET.
//user创建user时指定role为user，其他角色不可选！！！
exports.user_create_get = function(req, res) {
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
       res.render('user_form', { title: 'Create User',shelters:results.shelters, status:results.status,roles:results.roles });
       }
    );
};

// Handle user create on POST.
exports.user_create_post = [
    // Validate fields.
    body('given_name').isLength({ min: 1 }).trim().withMessage('Given name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('password').isLength({ min: 1 }).trim().withMessage('password must be specified.'),
    body('birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('sex').isLength({min: 1}).trim().withMessage('sex must be specified'),
    body('age').isLength({min: 1}).trim().withMessage('age must be specified'),
    body('address').isLength({min: 1}).trim().withMessage('address must be specified'),
    body('telephone').isLength({min: 1}).trim().withMessage('telephone must be specified'),
    //note
    body('shelter', 'Shelter must not be empty.').isLength({ min: 1 }).trim(),
    body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
    body('role', 'Role must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields. note shelter status role
    body('given_name').escape(),
    body('family_name').escape(),
    body('birth').toDate(),
    body('passwors').escape(),
    body('sex').escape(),
    body('age').escape(),
    body('address').escape(),
    body('telephone').escape(),
    body('note').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var user = new User(
        { 
            //note
            given_name: req.body.given_name,
            family_name: req.body.family_name,
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
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
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
                res.render('user_form', { title: 'Create User',shelters:results.shelters, status:results.status, roles: result.roles, errors: errors.array() });
            });
            return;
        }else {
            user.save(function (err) {
                if (err) { return next(err); }
                   res.redirect(user.url);
                });
        }
    }
];

exports.user_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        user : function(callback) {
            User.findById(id)
                .populate('shelter')
                .populate('status')
                .populate('role')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { 
            res.redirect('/catalog/user');
        }
        res.render('user_delete', { title: 'Delete user', user: results.user } );
    });
}; 

exports.user_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    async.parallel({
        user: function(callback) {
            User.findById(id)
                .populate('shelter')
                .populate('status')
                .populate('role')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        User.findByIdAndRemove(id, function deleteUser(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/user');
        });     
    });
};

exports.user_update_get = function(req, res, next) {
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
                .populate('shelter')
                .populate('status')
                .populate('role')
                .exec(callback);
        },
        shelters: function(callback) {
            Shelter.find(callback);
        },
        status: function(callback) {
            Status.find(callback);
        },
        roles: function(callback) {
            //点开的user url的role
            Role.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.user==null) { 
                var err = new Error('User not found');
                err.status = 404;
                return next(err);
            }
            res.render('user_form', { title: 'Update User', shelters: results.shelters, status: results.status, roles: results.roles, user: results.user });
        });
};

exports.user_update_post = [
    (req, res, next) => {
        if(!(req.body.status instanceof Array)){
            if(typeof req.body.status==='undefined')
                req.body.status=[];
            else
                req.body.status=new Array(req.body.status);
        }
        next();
    },
    // Validate fields.
    body('shelter', 'Shelter must not be empty.').isLength({ min: 1 }).trim(),
    body('status', 'Status must not be empty.').isLength({ min: 1 }).trim(),
    body('role', 'Role must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields.
    body('shelter').escape(),
    body('status').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var user = new User(
        { 
            given_name:req.body.given_name,
            family_name: req.body.family_name,
            birth: req.body.birth,
            age:req.body.age,
            sex:req.body.sex,
            password:req.body.password,
            address:req.body.address,
            telephone:req.body.telephone,
            note:req.body.note,
            shelter: req.body.shelter,
            status: req.body.status,
            role: req.body.role,
            is_authenticated:req.body.is_authenticated,
            _id:req.params.id // This is required, or a new ID will be assigned!
        });
        if (!errors.isEmpty()) {
            async.parallel({
                shelter: function(callback) {
                    Shelter.find(callback);
                },
                status: function(callback) {
                    Status.find(callback);
                },
                role:function(callback){
                    Role.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err); }
                for (let i = 0; i < results.shelter.length; i++) {
                    if (user.shelter.indexOf(results.shelters[i]._id) > -1) {
                        results.shelters[i].checked='true';
                    }
                }
                res.render('user_form', { title: 'Update user',given_name:results.given_name,family_name:results.family_name,sex:results.sex,
                    birth:results.birth,age:results.age,address:results.address,telephone: results.telephone,password:results.password,
                    note:results.note,shelters:results.shelters, status:results.status, roles: results.role, is_authenticated:results.is_authenticated,errors: errors.array() });
            });
            return;
        }else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(req.params.id, user, {}, function (err,theuser) {
                if (err) { return next(err); }
                   res.redirect(theuser.url);
            });
        }
    }
];

exports.avatar_upload=function(req,res,next){
    var login_user_id = req.session.user._id;
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    //上传路径
    form.uploadDir = 'public/images/avatars/';
    form.keepExtensions = true;//设置该属性为true可以使得上传的文件保持原来的文件的扩展名
    form.maxFieldsSize = 2*1024*1024;//限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
    form.parse(req,function(err,fields,files){//该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
        if(err){
            res.locals.error = err;
            console.log("parse error");
            res.redirect('/catalog');
            return;
        }
        console.log(files);
        var ext_name = '';
        switch(files.ful_avatar.type){
        case 'image/pjpeg':
            ext_name ='jpg';
            break;
        case 'image/jpeg':
            ext_name ='jpg';
            break;
        case 'image/png':
            ext_name='png';
            break;
        case 'image/x-png':
            ext_name='png';
            break;
        };
        if(ext_name.length==0){
            res.locals.error='Only png and jpg formats are supported';
            res.redirect('/catalog');
            return;
        };
        var avatar_name = login_user_id+'.'+ext_name;
        var new_path = form.uploadDir+avatar_name;
        var show_url = '/images/avatars/'+avatar_name;
        var imgName = path.basename(new_path);//提取出用 ‘/' 隔开的path的最后一部分
        fs.rename(files.ful_avatar.path,new_path,function(err){//对上传后的图片进行重命名并更改存储路径
            if (err) {
                res.send({
                    ok: false,
                    msg: "上传成功但改名失败"
                });
                return;
            }
            console.log("old_path",files.ful_avatar.path);
            console.log("new_path",new_path);
            imageMagick(new_path)//进行图片剪裁和压缩
            .resize(580)// 等比变成宽度580
            .crop(580,580, 0, 0)// 保留高度580，使不溢出
            .write(new_path, function (err) {//压缩后的图片重新写入
                if (err) {
                    res.send({
                        ok: false,
                        msg: "写入失败"
                    });
                    return;
                }
                User.findByIdAndUpdate(login_user_id, {avatar_url:show_url}, function (err) {//更新数据库头像链接
                    if (err) { return next(err); }
                    console.log("database updated");
                    // res.redirect('/catalog');
                    res.render("cut_image", {imgName:imgName});
                });
            });
    });
    });    
};

exports.handle_cut = function (req, res) {
    var imgName = req.body.imgname;
    var w = req.body.w;
    var h = req.body.h;
    var x = req.body.x;
    var y = req.body.y;
    var new_file = 'public/images/avatars/'+imgName;
    imageMagick(new_file)
    .crop(w, h, x, y)
    .resize(100, 100, "!")// "!"表示强制缩放成目标大小
    .write(new_file, function (err) {
        if (err) {
            res.send({
                ok: false,
                msg: "写入失败"
            });
            return;
        }
        res.send({
            ok: true,
            msg: "成功"
        });
    });
};



exports.create_qrcode = function(req, res){
    var text = req.session.user._id;
    try {
      var img = qr.image(text,{size :10});
      res.writeHead(200, {'Content-Type': 'image/png'});
      img.pipe(res);
    } catch (e) {
      res.writeHead(414, {'Content-Type': 'text/html'});
      res.end('<h1>414 Request-URI Too Large</h1>');
    }
}

exports.show_qrcode = function(req, res) {
    res.render('show_qrcode', { title: 'My qrcode'});
};

exports.identification_upload_get = function(req,res,next){
    res.render('identification',{title:'upload identification'});
}
exports.identification_upload_post = function(req,res,next){
    var login_user_id = req.session.user._id;
    var form = new formidable.IncomingForm();
    form.encoding='utf-8';
    form.uploadDir='public/images/identification/';
    form.keepExtensions = true;
    form.maxFieldsSize = 2*1024*1024;
    form.parse(req,function(err,fields,files){
        if(err){
            res.locals.error = err;
            console.log("parse error");
            res.redirect('/catalog');
            return;
        }
        console.log(files);
        var ext_name = '';
        switch(files.ful_avatar.type){
        case 'image/pjpeg':
            ext_name ='jpg';
            break;
        case 'image/jpeg':
            ext_name ='jpg';
            break;
        case 'image/png':
            ext_name='png';
            break;
        case 'image/x-png':
            ext_name='png';
            break;
        };
        if(ext_name.length==0){
            res.locals.error='Only png and jpg formats are supported';
            res.redirect('/catalog');
            return;
        };
        var ident_name = login_user_id+'.'+ext_name;
        var new_path = form.uploadDir+ident_name;
        var show_url = '/images/identification/'+ident_name;
        var img_name = path.basename(new_path);
        fs.rename(files.ful_avatar.path,new_path,function(err){//对上传后的图片进行重命名并更改存储路径
            if (err) {
                res.send({
                    ok: false,
                    msg: "上传成功但改名失败"
                });
                return;
            }
            console.log("old_path",files.ful_avatar.path);
            console.log("new_path",new_path);
            imageMagick(new_path)//进行图片剪裁和压缩
            // .resize(580)// 等比变成宽度580
            // .crop(580,580, 0, 0)// 保留高度580，使不溢出
            .write(new_path, function (err) {//压缩后的图片重新写入
                if (err) {
                    res.send({
                        ok: false,
                        msg: "写入失败"
                    });
                    return;
                }
                // User.findByIdAndUpdate(login_user_id, {avatar_url:show_url}, function (err) {//更新数据库头像链接
                //     if (err) { return next(err); }
                //     console.log("database updated");
                // res.redirect('/catalog');
                res.render('identification',{show_url:show_url});
            });
        });
    })
};

exports.facial_recognition_get = function(req,res){
    res.render('facial_recognition',{title:'顔写真を撮る'});
};

exports.facial_recognition_post = function(req,res,next){
    var login_user_id = req.session.user._id;
    var path ='public/images/facial_recognition/';
    var img_data = req.body.image_data;
    var dataBuffer = new Buffer(img_data, 'base64'); //把base64码转成buffer对象，
    var ident_name = login_user_id+'.png';
    var new_path = path+ident_name;
    fs.writeFile(new_path,dataBuffer,function(err){//用fs写入文件
        if(err){
            console.log(err);
        }else{
            console.log('ok！');
            res.redirect('/catalog');
        }
    });
};