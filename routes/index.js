var express = require('express');
var router = express.Router();
const login_controller = require ('../controllers/login_controller');
const register_controller = require('../controllers/register_controller');
const logout_controller = require('../controllers/logout_controller');
router.get('/login',login_controller.login_get);
router.post('/login',login_controller.login_post);
router.get('/register',register_controller.register_get);
router.post('/register',register_controller.register_post);
router.get('/logout',logout_controller.logout_get);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');});
module.exports = router;
