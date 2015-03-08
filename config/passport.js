// config/passport.js
console.log('loading passport...');
// load all the things we need
var LocalStrategy		= require('passport-local').Strategy;

// load up the user model
var User				= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

	/*
	 * =====================================================
	 * passport session setup
	 * =====================================================
	 * required for persistent login sessions
	 * passport needs ability to serialice and unserialice users
	 */

	//used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//used to deserialize the user
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
		  done(err, user);
		});
	});

	/*
	 * =====================================================
	 * LOCAL SETUP
	 * =====================================================
	 * we are using named strategies since we have one for login
	 * and one for signup, by default, if there was no name, it
	 * would just be called 'local'
	 */

	// Get user
	passport.use('user', new LocalStrategy({ passReqToCallback : true }, function(res, req, done) {
		process.nextTick(function() {
			console.log('user ' + req.user.email + ' is calling /api/user');
			User.findOne( {'userLocal.email' : req.params.email }, function(err, user) {
				if(err) {
					res.send(err);
					return done(err);
				}

				if(user) {
					res.json(user);
					return done(user);
				} else {
					return done(null, false, req.flash('signupMessage', 'El usuario no existe'));
				}
			});
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password
		// we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request
	}, function (req, email, password, done) {
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function () {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login alredy exist

			User.findOne( { 'userLocal.email' : email }, function (err, user) {
				// if there are any errors, return the error
				if(err) return done(err);

				//check to see if there is already a user with the email
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				} else {
					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.userLocal.email = email;
					newUser.userLocal.password = newUser.generateHash(password);

					// save the user
					newUser.save(function (err) {
						if(err) throw err;
						return done(null, newUser);
					});
				}
			} );
		});
	}));

	/*
	 * =====================================================
	 * LOCAL LOGIN
	 * =====================================================
	 */

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password
		// we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request
	}, function (req, email, password, done) { // callback with email and password

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login alredy exits
		User.findOne( { 'userLocal.email' : req.body.email }, function (err, user) {
			// if there ar any erros, return the error before anything else
			if(err) return done(err);

			// if no user is found, return the message
			if(!user) {
				return done(null, false, req.flash('loginMessage', 'No user found'));
			}

			// if the user is found, but the password is wrong
			if(!user.validPassword(req.body.password)) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrogn password!'));
			}

			// all is well, return successful user
			return done(null, user);
		} );
	}));
};
