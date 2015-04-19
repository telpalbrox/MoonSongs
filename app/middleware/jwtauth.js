// jwtauth.js
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = mongoose.model('User');
var q = require('q');

/**
 * Return token of request
 * @param req
 * @returns {String} token
 */
function getToken(req) {
  try {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      return parts[1];
    } else {
      authLogger.warn('[User request hasn\'t got token] | ' +
      '[User ip: ' + req.connection.remoteAddress + ']');
      return null;
    }
  } catch (err) {
    errorLogger.error('[Error getting token] | ' +
    '[Error: ' + err + ']');
    return null;
  }
}

/**
 * Decode a token
 * @param token
 * @returns {Object} User inside that token who make a request
 */
function decodeToken(token) {
  var deferred = q.defer();
  jwt.verify(token, 'albertoesmuylol', {}, function(err, decoded) {
    if(err) {
      errorLogger.error('[Error decoding token] | ' +
      '[Error: ' + err + ']');
      return deferred.reject('Error decoding token');
    }
    deferred.resolve(decoded);
  });
  return deferred.promise;
}

/**
 * Return database User
 * @param {String} userName - of token user
 * @returns {Object} User object from database
 */
function getUser(userName) {
  var deferred = q.defer();
  User.findOne( { 'userName' : userName }, function (err, user) {
    if(err) {
      errorLogger.error('[Error finding user] | ' +
      '[Error: ' + err + '] | ' +
      '[Look for userName: ' + userName + ']');
      return deferred.reject('Error finding user');
    }
    deferred.resolve(user);
  });
  return deferred.promise;
}

/**
 * Check if password of user is correct
 * @param user - User object from database
 * @param userToken - User object from token
 */
function ckeckPassword(user, userToken) {
    return user.password == userToken.password;
}

/**
 * Auth a request
 * @param req
 * @param callback
 */
function auth(req, callback) {
  var userToken, user;
  var token = getToken(req);
  if(!token) {
    callback(new Error('There is not token'));
    return;
  }

  decodeToken(token)
    .then(function (_userToken) {
      userToken = _userToken;
      return getUser(userToken.userName);
    })
    .then(function (_user) {
      user = _user;
      req.user = user;
      if(ckeckPassword(user, userToken)) {
        // console.log('req by ' + user.userName);
        req.user = user;
        callback(null, user);
      } else {
        callback(new Error('Wrong password'));
      }
    })
    .catch(function (err) {
      callback(err);
    })
    .done();
}

module.exports.allowAllUsers = function(req, res, next) {
  mainLogger.trace('[File: jwauth.js] | ' +
  '[Route MIDLEWARE] | ' +
  '[Function allowAllUsers] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  auth(req, function (err) {
    if(err) {
      errorLogger.error('[Error authenticate user] | ' +
      '[Error: ' + err + '] | ' +
      '[User id auth: ' + ( user ? user._id : 0) + ']');
      authLogger.warn('[Error authenticate user, see error log] | ' +
      '[User ip: ' + req.connection.remoteAddress + '] | ' +
      '[User id auth: ' + ( user ? user._id : 0) + ']');
      return res.status(401).send();
    }
    authLogger.info('[Successful user access] | ' +
    '[User ip: ' + req.connection.remoteAddress + '] |' +
    '[User id auth: ' + ( user ? user._id : 0) + '] | ');
    next();
  });
};

/**
 * Allow a user with a determinate permission
 * @param permission
 * @returns {Function}
 */
module.exports.allowUserType = function (permission) {
  return function (req, res, next) {
    mainLogger.trace('[File: jwauth.js] | ' +
    '[Route MIDLEWARE] | ' +
    '[Function allowUserType] | ' +
    '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    auth(req, function (err, user) {
      if(err) {
        errorLogger.error('[Error authenticate user] | ' +
        '[Error: ' + err + '] | ' +
        '[User id auth: ' + ( user ? user._id : 0) + ']');
        authLogger.warn('[Error authenticate user, see error log] | ' +
        '[User ip: ' + req.connection.remoteAddress + '] | ' +
        '[User id auth: ' + ( user ? user._id : 0) + ']');
        return res.status(401).send();
      }

      if(!user.permissions[permission]) {
        authLogger.warn('[User attempting to access without permission] | ' +
        '[User hasn\'t permission: ' + permission + ']' +
        '[User ip: ' + req.connection.remoteAddress + '] | ' +
        '[User id auth: ' + ( user ? user._id : 0) + ']');
        return res.status(401).send();
      }

      authLogger.info('[Successful user access] | ' +
      '[Permission: ' + permission + ']' +
      '[User ip: ' + req.connection.remoteAddress + '] |' +
      '[User id auth: ' + ( user ? user._id : 0) + '] | ');
      next();
    });
  };
};
