// app/controllers/users.controllers.js
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var async = require('async');

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

  if((req.user._id != req.params.id) && !req.user.permissions.admin) {
    authLogger.warn('No admins can\'t read other users');
    return res.sendStatus(401);
  }

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

  if((req.user._id != req.params.id) && !req.user.permissions.admin) {
    authLogger.warn('No admins can\'t update other users');
    return res.sendStatus(401);
  }

  if (!req.body.user) {
    res.status(400).send();
    return;
  }

  var updatedUser = req.body.user;

  if(!updatedUser._id) {
    updatedUser._id = req.params.id;
  }

  if(req.body.newPass) {
    updatedUser.password = bcrypt.hashSync(req.body.newPass, bcrypt.genSaltSync(8), null);
  }

  async.waterfall([function(callback) {
    User.findOne({_id: updatedUser._id}, function(err, user) {
      if(err) {
        errorLogger.error('Error getting user');
        errorLogger.error(err);
        return callback({
          statusCode: 500,
          message: 'Error getting user'
        });
      }
      if(!user) {
        return callback({
          statusCode: 404,
          message: 'User not found'
        });
      }
      console.log(areEqualPermissions(updatedUser.permissions, req.user.permissions));
      if(!areEqualPermissions(updatedUser.permissions, req.user.permissions) && !req.user.permissions.admin) {
        authLogger.warn('No admins can\'t update his owns permissions');
        return callback({
          statusCode: 401,
          message: 'You can\'t update your own permissions'
        });
      }
      callback();
    });
  }, function(callback) {
    User.update({_id: updatedUser._id}, updatedUser, function(err) {
      if(err) {
        errorLogger.error('Error updating user');
        errorLogger.error(err);
        return callback({
          statusCode: 500,
          message: 'Error updating user'
        });
      }
      callback();
    });
  }], function(err) {
    if(err) {
      return res.status(err.statusCode).send(err.message);
    }
    res.sendStatus(200);
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

function areEqualPermissions(perm1, perm2) {
  for(var key in perm1) {
    if(perm1.hasOwnProperty(key) && perm2.hasOwnProperty(key)) {
      if(perm1[key] != perm2[key]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}
