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
      return res.status(409).send('Ese usuario ya esta registrado'); //done(null, false, req.flash('signupMessage', 'That email is already taken'));
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
        res.status(201).send();
      });
    }
  });
};

exports.list = function(req, res) {
  if (!req.user.admin) {
    res.status(401).send();
    return;
  }
  User.find({}, function(err, users) {
    if(users.length === 0) {
      res.status(404).send();
      return;
    }
    res.json(users);
  });
};

exports.read = function(req, res) {
  if (!req.user.admin) {
    res.status(401).send();
    return;
  }
  User.findOne({
    _id: req.params.id
  }, function(err, user) {
    if (!user) {
      res.status(404).send();
      return;
    }
    res.json(user);
  });
};

exports.update = function(req, res) {
  if (!req.user.admin) {
    res.status(401).send();
    return;
  }
  if (!req.body.user) {
    res.status(409).send();
    return;
  }

  var user = req.body.user;
  var updateUser = {};
  var auxUser = new User();

  if (user.email !== undefined) updateUser.email = user.email;
  if (user.password !== undefined) updateUser.password = auxUser.generateHash(user.password);
  if (user.admin !== undefined) updateUser.admin = user.admin;
  if (user.userName !== undefined) updateUser.userName = user.userName;
  if (user.permissions !== undefined) {
    updateUser.permissions = {};
    if (user.permissions.canUpload !== undefined) updateUser.permissions.canUpload = user.permissions.canUpload;
    if (user.permissions.canListen !== undefined) updateUser.permissions.canListen = user.permissions.canListen;
  }

  User.findOneAndUpdate({
    '_id': req.params.id
  }, {
    $set: updateUser
  }, function(err, user) {
    if (err) res.status(501).send();
    if (!user) res.status(404).send();
    res.status(201).send();
  });
};

exports.delete = function(req, res) {
  if (!req.user.admin) {
    res.send(401);
    return;
  }
  User.findOneAndRemove({
    '_id': req.params.id
  }, function(err, user) {
    if (err) res.status(404).send();
    if (!user) res.status(404).send();
    res.status(200).send();
  });
};
