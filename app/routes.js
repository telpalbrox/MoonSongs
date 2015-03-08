// routes.js
console.log('loading routes...');

var Song = require('../app/models/song.js');
var User = require('../app/models/user.js');
var jwtauth = require('../config/jwtauth.js');
var async = require('async');
var path = require('path');
var musicDir = path.dirname(__dirname)+'/music';
var uploadsDir = path.dirname(__dirname)+'/uploads';
var multer  = require('multer');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var moment = require('moment');
var request = require('request');

var SECRET = "albertoesmuylol";
var musicDir = path.dirname(__dirname)+'/music';

module.exports = function(app) {

  // We are going to protect /private routes with JWT
  //app.use('/private', expressJwt({secret: SECRET}));

  app.all('/private/*', jwtauth);

  // load user routes
  require('../app/routes/users.routes.js')(app);
  // load song routes
  require('../app/routes/songs.routes.js')(app);
  // load uploads routes
  require('../app/routes/uploads.routes.js')(app);

  // TOKEN
  app.post('/public/authenticate', function(req, res) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login alredy exits
    var userName = req.body.userName;
    var password = req.body.password;
    User.findOne( { 'userName' : req.body.userName }, function (err, user) {
      // if there ar any erros, return the error before anything else
      if(err) return done(err);

      // if no user is found, return the message
      if(!user) {
        res.send(401, 'Unauthorized request, wrong user');
        return;
      }

      // if the user is found, but the password is wrong
      if(!user.validPassword(req.body.password)) {
        res.send(401, 'Unauthorized request, wrong pass');
        return;
      }

      user.exp = moment().add(1, 'minutes');
      var token = jwt.sign(user, SECRET, {expiresInMinutes: 1});
      console.log(token);
      res.json( { 'token' : token } );
    } );
  });
};
