const express = require('express');
const router = express.Router();
//
var _ = require('lodash');
var acl = require('acl');
var mongoose = require('mongoose');

// 导入控制器模块
const status_controller = require('../controllers/status_Controller');
const supply_controller = require('../controllers/supply_controller');
const user_controller = require('../controllers/user_controller');
const role_controller = require('../controllers/role_controller');
const shelter_controller = require('../controllers/shelter_controller');
const relationship_controller = require('../controllers/relationship_controller');
const shelter_need_supply_controller = require('../controllers/shelter_need_supply_controller');
const shelter_own_supply_controller = require('../controllers/shelter_own_supply_controller');
const user_shelter_controller = require('../controllers/user_shelter_controller');
const friends_auth_controller = require('../controllers/friends_auth_controller');

//permisson
 function path_deal(subject) {
    var urlParts = subject.split('/');
 	var dealt = _.map(urlParts, function(part) { 
 	    if (part.match(/[0-9a-fA-F]{24}/)) { 
 	        var param = ':id';
 	        return param;
        } else{
            return part;
        }
 	});	
 	return dealt.join("/");
 };
var route = function(req, res, next) {
    var nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db,'_acl'));
    // check permissions
    nodeAcl.isAllowed(req.session.user._id,path_deal(req.path) ,'*', function(err, allow) {
        if (err) {
              return res.send(500, 'Unexpected authorization error');
        }
        if (allow) {
              return next();
        }        
          return res.send(403);
        });      
  };
router.get('/',user_controller.index);
router.get('/supply',route,supply_controller.all_supplies);
router.get('/status',route, status_controller.all_status);
router.get('/role',route,role_controller.all_roles);
router.get('/shelter',route, shelter_controller.all_shelters);
router.get('/user',route,user_controller.all_users);
router.get('/relationship',route,relationship_controller.all_relationship);
router.get('/shelter_need_supply',route,shelter_need_supply_controller.all_shelter_need_supply);
router.get('/shelter_own_supply',route,shelter_own_supply_controller.all_shelter_own_supply);
router.get('/user_shelter',route,user_shelter_controller.all_user_shelter);

router.get('/supply/create',route, supply_controller.supply_create_get);
router.post('/supply/create',route, supply_controller.supply_create_post);
router.get('/supply/:id',route, supply_controller.supply_detail);
router.get('/supply/:id/delete',route,supply_controller.supply_delete_get);
router.post('/supply/:id/delete',route,supply_controller.supply_delete_post);
router.get('/supply/:id/update',route,supply_controller.supply_update_get);
router.post('/supply/:id/update',route,supply_controller.supply_update_post);

router.get('/status/create',route, status_controller.status_create_get);
router.post('/status/create',route, status_controller.status_create_post);
router.get('/status/:id',route, status_controller.status_detail);
router.get('/status/:id/delete',route,status_controller.status_delete_get);
router.post('/status/:id/delete',route,status_controller.status_delete_post);
router.get('/status/:id/update',route,status_controller.status_update_get);
router.post('/status/:id/update',route,status_controller.status_update_post);

router.get('/shelter/create',route, shelter_controller.shelter_create_get);
router.post('/shelter/create',route, shelter_controller.shelter_create_post);
router.get('/shelter/:id',route, shelter_controller.shelter_detail);
router.get('/shelter/:id/delete',route,shelter_controller.shelter_delete_get);
router.post('/shelter/:id/delete',route,shelter_controller.shelter_delete_post);
router.get('/shelter/:id/update',route,shelter_controller.shelter_update_get);
router.post('/shelter/:id/update',route,shelter_controller.shelter_update_post);

router.get('/user/create',route, user_controller.user_create_get);
router.post('/user/create',route, user_controller.user_create_post);
router.get('/user/create_qrcode',route,user_controller.create_qrcode);
router.get('/user/show_qrcode',route,user_controller.show_qrcode);
router.get('/user/identification',route,user_controller.identification_upload_get);
router.post('/user/identification',route,user_controller.identification_upload_post);
router.get('/user/facial_recognition',route,user_controller.facial_recognition_get);
router.post('/user/facial_recognition',route,user_controller.facial_recognition_post);
router.get('/user/:id',route, user_controller.user_detail);
router.get('/user/:id/delete',route,user_controller.user_delete_get);
router.post('/user/:id/delete',route,user_controller.user_delete_post);
router.get('/user/:id/update',route,user_controller.user_update_get);
router.post('/user/:id/update',route,user_controller.user_update_post);
router.post('/user/avatar_upload',route,user_controller.avatar_upload);
router.post('/user/handle_cut',route,user_controller.handle_cut);


router.get('/shelter_own_supply/create',route, shelter_own_supply_controller.shelter_own_supply_create_get);
router.post('/shelter_own_supply/create',route, shelter_own_supply_controller.shelter_own_supply_create_post);
router.get('/shelter_own_supply/:id',route, shelter_own_supply_controller.shelter_own_supply_detail);
router.get('/shelter_own_supply/:id/delete',route,shelter_own_supply_controller.shelter_own_supply_delete_get);
router.post('/shelter_own_supply/:id/delete',route,shelter_own_supply_controller.shelter_own_supply_delete_post);
router.get('/shelter_own_supply/:id/update',route,shelter_own_supply_controller.shelter_own_supply_update_get);
router.post('/shelter_own_supply/:id/update',route,shelter_own_supply_controller.shelter_own_supply_update_post);

router.get('/shelter_need_supply/create',route, shelter_need_supply_controller.shelter_need_supply_create_get);
router.post('/shelter_need_supply/create',route, shelter_need_supply_controller.shelter_need_supply_create_post);
router.get('/shelter_need_supply/:id',route, shelter_need_supply_controller.shelter_need_supply_detail);
router.get('/shelter_need_supply/:id/delete',route,shelter_need_supply_controller.shelter_need_supply_delete_get);
router.post('/shelter_need_supply/:id/delete',route,shelter_need_supply_controller.shelter_need_supply_delete_post);
router.get('/shelter_need_supply/:id/update',route,shelter_need_supply_controller.shelter_need_supply_update_get);
router.post('/shelter_need_supply/:id/update',route,shelter_need_supply_controller.shelter_need_supply_update_post);

router.get('/relationship/research',route, relationship_controller.relationship_research_get);
router.post('/relationship/research',route, relationship_controller.relationship_research_post);
router.get('/relationship/:id/accept',route, relationship_controller.relationship_accept_get);
router.get('/relationship/request/:id',route,relationship_controller.relationship_request_get);
router.post('/relationship/request/:id',route,relationship_controller.relationship_request_post);
router.get('/relationship/:id/refuse',route, relationship_controller.relationship_refuse_get);
router.post('/relationship/:id/refuse',route, relationship_controller.relationship_refuse_post);
router.get('/relationship/all_friends',route, relationship_controller.all_friends_get);
router.get('/relationship/:id/message',route, relationship_controller.relationship_message_get);
router.post('/relationship/:id/message',route, relationship_controller.relationship_message_post);

router.get('/friends_auth/create',route,friends_auth_controller.friends_auth_create_get);

module.exports = router;