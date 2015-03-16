// app/controllers/users.controllers.js
console.log('loading user controller');

/**
 * Module dependencies
 */
var User = require('../models/user.js');

exports.create = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var admin = req.body.admin;
  var userName = req.body.userName;
  var canUpload = req.body.canUpload;
  var canListen = req.body.canListen;
  User.findOne({
    'userName': userName
  }, function(err, user) {
    // if there are any errors, return the error
    if (err) return res.send(err);

    //check to see if there is already a user with the email
    if (user) {
      return res.send(409, 'Ese usuairo ya esta registrado'); //done(null, false, req.flash('signupMessage', 'That email is already taken'));
    } else {
      // if there is no user with that email
      // create the user
      var newUser = new User();

      // set the user's local credentials
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.admin = admin;
      newUser.userName = userName;
      newUser.permissions.canUpload = canUpload;
      newUser.permissions.canListen = canListen;

      // save the user
      newUser.save(function(err) {
        if (err) res.send(err);
        res.send(201);
      });
    }
  });
};

exports.list = function(req, res) {
  if (!req.user.admin) {
    res.send(401);
    return;
  }
  User.find({}, function(err, users) {
    res.json(users);
  });
};

exports.read = function(req, res) {
  if (!req.user.admin) {
    res.send(401);
    return;
  }
  User.findOne({
    _id: req.param('id')
  }, function(err, user) {
    res.json(user);
  });
};

exports.update = function(req, res) {
  if (!req.user.admin) {
    res.send(401);
    return;
  }
  Song.update({
      '_id': req.param('id')
    }, {
      'email': req.body.user.email,
      'password': req.body.user.password,
      'admin': req.body.user.admin,
      'userName': req.body.user.userName,
      'permissions': {
        'canUpload': req.body.user.canUpload,
        'canListen': req.body.user.canListen
      }
    },
    function(err, numberAffected, raw) {
      if (err) res.send(err);
      if (numberAffected === 0) res.send(404, 'Ese _id no existe');
      res.send(200);
    });
};

exports.delete = function(req, res) {
  if (!req.user.admin) {
    res.send(401);
    return;
  }
  User.find({
    _id: req.param('id')
  }).remove(function(err, numberAffected, raw) {
    if (err) res.send(err);
    if (numberAffected === 0) res.send(404, 'Ese _id no existe');
    res.send(200);
  });
};
