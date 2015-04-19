// app/controllers/users.controllers.js
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.create = function(req, res) {
  mainLogger.trace('[File: users.controller.js] | ' +
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

exports.list = function(req, res) {
  mainLogger.trace('[File: users.controller.js] | ' +
  '[Route GET /api/users] | ' +
  '[Function list] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  User.find({}, function(err, users) {
    if(err) {
      errorLogger.error('Error getting users');
      errorLogger.error(err);
      return;
    }
    if(users.length === 0) {
      res.status(404).send();
      return;
    }
    res.json(users);
  });
};

exports.read = function(req, res) {
  mainLogger.trace('[File: users.controller.js] | ' +
  '[Route GET /api/users/' + req.params.id +'] | ' +
  '[Function read] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if(err) {
      errorLogger.error('Error getting user');
      errorLogger.error(err);
      return;
    }
    if (!user) {
      res.status(404).send();
      return;
    }
    res.json(user);
  });
};

exports.update = function(req, res) {
  mainLogger.trace('[File: users.controller.js] | ' +
  '[Route PUT /api/users/' + req.params.id +'] | ' +
  '[Function update] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  if (!req.body.user) {
    res.status(409).send();
    return;
  }

  var user = req.body.user;
  var updateUser = {};
  var auxUser = new User();

  if (user.email !== undefined) updateUser.email = user.email;
  if (user.password !== undefined) updateUser.password = auxUser.generateHash(user.password);
  if (user.userName !== undefined) updateUser.userName = user.userName;
  if (user.permissions !== undefined) {
    updateUser.permissions = {};
    if (user.permissions.canUpload !== undefined) updateUser.permissions.canUpload = user.permissions.canUpload;
    if (user.permissions.canListen !== undefined) updateUser.permissions.canListen = user.permissions.canListen;
    if (user.permissions.admin !== undefined) updateUser.permissions.admin = user.permissions.admin;
  }

  User.findOneAndUpdate({
    '_id': req.params.id
  }, {
    $set: updateUser
  }, function(err, user) {
    if (err) {
      errorLogger.error('Error updating user');
      errorLogger.error(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(404).send();
    }
    res.status(201).send();
  });
};

exports.delete = function(req, res) {
  mainLogger.trace('[File: users.controller.js] | ' +
  '[Route DELETE /api/users/' + req.params.id +'] | ' +
  '[Function delete] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');
  authLogger.info('[Attempting delete user: ' + req.params.id +'] | ' +
  '[Request from: ' + ( req.user ? req.user._id : 0) +']');

  User.findOneAndRemove({
    '_id': req.params.id
  }, function(err, user) {
    if (err) {
      authLogger.warn('[Delete failed, error finding userName, see error log]');
      errorLogger.error('Error deleting user');
      errorLogger.error(err);
      return res.status(500).send();
    }
    if (!user) {
      authLogger.warn('[Delete failed, user not found]');
      return res.status(404).send();
    }
    authLogger.info('[Delete successful, deleted user id: ' + req.params.id +']');
    res.status(200).send();
  });
};
