var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login', 
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Oops! Something is wrong. Please check your username/password.'}),
  function(req, res) {
  	req.flash('success', 'Welcome to your secure parking area.');
  	res.redirect('/');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
	User.getUserByUsername(username, function(err, user){
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Looks like you are not registered yet.'});
		}
		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else{
				return done(null, false, {message:'Wrong authentication details entered.'});
			}
		});
	});
}));

router.post('/register', function(req, res, next) {
  var formRegisterName = req.body.formRegisterName;
  var formRegisterEmail = req.body.formRegisterEmail;
  var formRegisterUsername = req.body.formRegisterUsername;
  var formRegisterPassword = req.body.formRegisterPassword;
  var formRegisterConfirmPassword = req.body.formRegisterConfirmPassword;

  //Validate form
  req.checkBody('formRegisterName', 'Name field is required').notEmpty();
  req.checkBody('formRegisterEmail', 'Email field is required').notEmpty();
  req.checkBody('formRegisterEmail', 'Email is not valid').isEmail();
  req.checkBody('formRegisterUsername', 'Username field is required').notEmpty();
  req.checkBody('formRegisterPassword', 'Password field is required').notEmpty();
  req.checkBody('formRegisterConfirmPassword', 'Passwords do not match').equals(req.body.formRegisterPassword);

  //Check errors
  var errors = req.validationErrors();

  if(errors){
  	res.render('register', {
  		errors: errors
  	});
  } else {
  	var newUser = new User({
  		name: formRegisterName,
  		email: formRegisterEmail,
  		username: formRegisterUsername,
  		password: formRegisterPassword
  	});

  	User.createUser(newUser, function(err, user){
  		if(err) throw err;
  		console.log(user);
  	});

	req.flash('success', 'You are now a BrisKing. Please go ahead and login');

  	res.location('/');
  	res.redirect('/');
  }

});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You successfully logged out. See you soon!');
	res.redirect('/users/login');
});

module.exports = router;
