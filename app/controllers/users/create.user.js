var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res) {
    mainLogger.trace('[File: create.user.js] | ' +
        '[Route POST /api/users] | ' +
        '[Function create] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var email = req.body.email;
    var password = req.body.password;
    var admin = req.body.admin;
    var userName = req.body.userName;
    var canUpload = req.body.canUpload;
    var canListen = req.body.canListen;

    authLogger.info('[Attempting create user: ' + userName +'] | ' +
        '[Request from: ' + ( req.user ? req.user._id : 0) +']');

    User.findOne({
        'userName': userName
    }, function(err, user) {
        // if there are any errors, return the error
        if (err) {
            authLogger.warn('[Create failed, error finding userName, see error log]');
            errorLogger.error('Error finding user');
            errorLogger.error(err);
            return res.sendStatus(500);
        }

        //check to see if there is already a user with the email
        if (user) {
            authLogger.warn('[Create failed, that userName is already register]');
            return res.status(409).send('Ese usuario ya esta registrado'); //done(null, false, req.flash('signupMessage', 'That email is already taken'));
        } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.userName = userName;
            newUser.permissions.canUpload = canUpload;
            newUser.permissions.canListen = canListen;
            newUser.permissions.admin = admin;

            // save the user
            newUser.save(function(err) {
                if (err) {
                    authLogger.warn('[Create failed, error saving user]');
                    errorLogger.error('Error saving user');
                    errorLogger.error(err);
                    return res.sendStatus(500);
                }
                authLogger.info('[Create successful, user _id: ' + newUser._id + ']');
                res.status(201).send();
            });
        }
    });
};
