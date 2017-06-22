var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.get('/', function(req, res, next){

  var appInfo = {
    "AppName": "BrisKing",
    "version": 1.0
  }

  res.json(appInfo);
});

router.post('/register', function(req, res, next){

  var apiRegisterNameIn = req.body.apiRegisterName;
  var apiRegisterEmailIn = req.body.apiRegisterEmail;
  var apiRegisterUsernameIn = req.body.apiRegisterUsername;
  var apiRegisterPasswordIn = req.body.apiRegisterPassword;

  if (!apiRegisterNameIn || !apiRegisterEmailIn || !apiRegisterUsernameIn || !apiRegisterPasswordIn){
    console.log("apiRegisterName = "+apiRegisterNameIn);
    console.log("apiRegisterEmail = "+apiRegisterEmailIn);
    console.log("apiRegisterUsername = "+apiRegisterUsernameIn);
    console.log("apiRegisterPassword = "+apiRegisterPasswordIn);
    res.json({success: false, msg: 'Invalid username or password'});
  }
  else {
    var newUser = new User({
  		name: apiRegisterNameIn,
  		email: apiRegisterEmailIn,
  		username: apiRegisterUsernameIn,
  		password: apiRegisterPasswordIn
  	});
    User.createUser(newUser, function(err, user){
  		if(err) {
        return res.json({success: false, msg: 'User already exist'});
      }
      res.json({success: true, msg: 'You are now a BrisKing. Please go ahead and login'});
  	});
  }
});

router.post('/login', function(req, res){
  User.findOne({username: req.body.apiRegisterUsername}, function(err, user){
    if(err) throw err;
    if(!user){
      res.send({success: false, msg: 'Looks like you are not registered yet.'});
    } else {
      User.comparePassword(req.body.apiRegisterPassword, user.password, function(err, isMatch){
        if(isMatch && !err) {
          var token = jwt.sign(user, '1qaz2wsx@');
          res.json({success: true, token: token});
        } else {
          res.json({success: false, msg: 'Authentication failed. Invalid username or password.'});
        }
		});
    }
  });
});

module.exports = router;