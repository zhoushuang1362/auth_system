var Relationship = require('../models/relationship');
var User = require('../models/user');
var mongoose = require('mongoose');
var async = require('async')
const { body, validationResult } = require('express-validator');
exports.all_relationship = function(req,res,next){ 
  var user=req.session.user
    if(req.session.user.role.role_name=='root'){
      Relationship.find()
        .populate('user')
        .populate('friend')
        .exec(function (err, allrelationship) {
            if (err) { return next(err); }
            res.render('all_relationship', { title: 'All relationship ', all_relationship: allrelationship,user_login:user });
        })
    }else{
      Relationship.find().or([{user:user._id},{friend:user._id}])
        .populate('user')
        .populate('friend')
        .exec(function (err, allrelationship) {
            if (err) { return next(err); }
            res.render('all_relationship', { title: 'All relationship about me', all_relationship: allrelationship,user_login:user });
        })
      }
};

exports.relationship_research_get = function(req,res,next){
  //?
    res.render('rela_research',{all_users:[]});
};

exports.relationship_research_post = function(req,res,next){
  var user_login=req.session.user
  Relationship.find().or([{user:user_login._id},{friend:user_login._id}])
                      .exec(function(error,found_relationships)
                      {
                        if(error){return next(error);}
                        var friend_set = new Set();
                        var array = new Array();
                        for(let relationship of found_relationships){
                          friend_set.add(relationship.user);
                          friend_set.add(relationship.friend);
                        }
                        var array = Array.from(friend_set);
                        User.find({'telephone':req.body.telephone,_id:{$nin:array}})
                            .exec(function(err,found_users){
                              if(err){return next(err);}
                              console.log(found_users);
                              res.render('rela_research',{user_login:req.session.user,all_users:found_users,
                              telephone:req.body.telephone})
                            });
                      });
};

// exports.relationship_request_get = function(req,res,next){
//    var relationship = new Relationship({
//       user : req.session.user._id,
//       friend :req.params.id,
//       date_of_request:Date.now(),
//       is_accepted:null
//       //rela_type:
//     });
//     relationship.save(function(err){
//       if(err){return next (err);}
//       res.redirect('/catalog/relationship');
//     });
// };

exports.relationship_request_get = function(req,res,next){
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({ 
    user : function(callback){  
      User.findById(id)
      .exec(callback)
    },
  },function(err, results){
    if (err) { return next(err); }
    if (results.user == null) { 
      var err = new Error('user not found');
      err.status = 404;
      return next(err);
    }
      console.log(results.user);
      res.render('rela_request_detail',{user_login:req.session.user,found_user:results.user,telephone:req.body.telephone})
  });
};

exports.relationship_request_post = function(req,res,next){
  var relationship = new Relationship({
          user : req.session.user._id,
          friend :req.params.id,
          date_of_request:Date.now(),
          is_accepted:null,
          rela_type:req.body.rela_type,
          message:req.session.user.family_name+req.session.user.given_name+":"+req.body.message,
        });
        relationship.save(function(err){
          if(err){return next (err);}
          res.redirect('/catalog/relationship');
        });
};

exports.relationship_accept_get = function(req,res,next){
  Relationship.findById(req.params.id).exec(function(err,theRelationship){
    if(err){return next(err);}
    if (theRelationship){
      theRelationship.is_accepted=true;
      theRelationship.date_of_confirm = Date.now();
      Relationship.findByIdAndUpdate(req.params.id, theRelationship,{},function(err){
        if(err){return next(err);}
        res.redirect('/catalog/relationship');
      });
    }else{
      res.redirect('/catalog/relationship');
    }
  })
};

exports.relationship_refuse_get = function(req,res,next){
  Relationship.findById(req.params.id)
  .populate('user')
  .exec(function(err,theRelationship){
    if(err){return next(err);}
    if(theRelationship){
      res.render('rela_refuse_detail',{theRelationship:theRelationship});
    }else{
      var err = new Error('user not found');
      err.status = 404;
      return next(err);
    } 
  });
};
exports.relationship_refuse_post = function(req,res,next){
  Relationship.findById(req.params.id)
  .exec(function(err,theRelationship){
    if(err){return next(err);}
    if(theRelationship){
       theRelationship.is_accepted =false;
       theRelationship.date_of_confirm = Date.now();
       theRelationship.message=theRelationship.message+"\n"+req.session.user.family_name+req.session.user.given_name+":"+req.body.refuse_message;
       console.log(theRelationship.message);
       Relationship.findByIdAndUpdate(req.params.id,theRelationship,{},function(err){
         if(err){return next(err);}
         res.redirect('/catalog/relationship');
       });
    }else{
       res.redirect('/catalog/relationship');
    } 
  });
};

exports.all_friends_get = function(req,res,next){
  var user=req.session.user
  Relationship.find().or([{user:user._id,is_accepted:true},{friend:user._id,is_accepted:true}])
        .populate({path:'friend',
          //嵌套populate
          populate:{path:'status'},   
          })
        .populate({path:'friend',
          //嵌套populate
          populate:{path:'shelter'},   
        })
        .populate({path:'user',
          //嵌套populate
          populate:{path:'status'},        
        })
        .populate({path:'user',
          //嵌套populate
          populate:{path:'shelter'},        
        })
        .exec(function (err, all_friends) {
            if (err) { return next(err); }
            res.render('all_friends', { title: 'All friends of me', all_friends: all_friends});
        })
};
//message
exports.relationship_message_get = function(req,res,next){
  Relationship.findById(req.params.id)
  .populate('user')
  .exec(function(err,theRelationship){
    if(err){return next(err);}
    if(theRelationship){
      res.render('message_detail',{theRelationship:theRelationship});
    }else{
      var err = new Error('user not found');
      err.status = 404;
      return next(err);
    } 
  });
};
exports.relationship_message_post = function(req,res,next){
  Relationship.findById(req.params.id)
  .exec(function(err,theRelationship){
    if(err){return next(err);}
    if(theRelationship){
       theRelationship.message=theRelationship.message+"\n"+req.session.user.family_name+req.session.user.given_name+":"+req.body.refuse_message;
       console.log(theRelationship.message);
       Relationship.findByIdAndUpdate(req.params.id,theRelationship,{},function(err){
         if(err){return next(err);}
         res.redirect('/catalog/relationship');
       });
    }else{
       res.redirect('/catalog/relationship');
    } 
  });
};
// exports.all_friends_post = function(req,res,next){
// var user_login=req.session.user
// Relationship.find().or([{user:user_login._id},{friend:user_login._id}])
//                     .exec(function(error,found_relationships)
//                     {
//                       if(error){return next(error);}
//                       var friend_set = new Set();
//                       var array = new Array();
//                       for(let relationship of found_relationships){
//                         friend_set.add(relationship.user);
//                         friend_set.add(relationship.friend);
//                       }
//                       var array = Array.from(friend_set);
//                       User.find({'telephone':req.body.telephone,_id:{$nin:array}})
//                           .exec(function(err,found_users){
//                             if(err){return next(err);}
//                             console.log(found_users);
//                             res.render('rela_research',{user_login:req.session.user,all_users:found_users,
//                             telephone:req.body.telephone})
//                           });
//                     });
// };