// jwtauth.js
console.log('loading auth method...');
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
      // console.error('No hay token...');
      return null;
    }
  } catch (e) {
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
    if(err) throw err;
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
  auth(req, function (err) {
    if(err) {
      // console.error(err);
      return res.status(401).send();
    }

    next();
  });
};

module.exports.allowOnlyListen = function(req, res, next) {
  auth(req, function(err, user) {
    if(err) {
      console.error(err);
      return res.status(401).send();
    }
    if(!user.permissions.canListen) {
      console.log(user.userName + ' is not allowed to listen');
      return res.status(401).send();
    }

    next();
  });
};

module.exports.allowOnlyUpload = function (req, res, next) {
  auth(req, function(err, user) {
    if(err) {
      // console.error(err);
      return res.status(401).send();
    }
    if(!user.permissions.canUpload) {
      // console.log(req.user.userName + ' is not allowed to upload');
      return res.status(401).send();
    }

    next();
  });
};

module.exports.allowOnlyAdmin = function(req, res, next) {
  auth(req, function(err, user) {
    if(err) {
      // console.error(err);
      return res.status(401).send();
    }
    if(!user.admin) {
      // console.log(req.user.userName + ' is not admin');
      return res.status(401).send();
    }

    next();
  });
};
