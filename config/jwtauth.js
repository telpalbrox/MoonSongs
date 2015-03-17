 // jwtauth.js
 console.log('loading auth method...');
 var jwt = require('jsonwebtoken');
 var User = require('../app/models/user.js');

 module.exports = function(req, res, next) {
   if (req.headers && req.headers.authorization) {
     var parts = req.headers.authorization.split(' ');
     var token = parts[1];
     var encodedUser = token.split('.')[1];
     jwt.verify(token, 'albertoesmuylol', {}, function(err, decoded) {
       var userToken = decoded;
       // console.log('Peticion de: '+userToken.userName);
       User.findOne( { 'userName' : userToken.userName }, function (err, user) {
         // if there ar any erros, return the error before anything else
         if(err) return res.send(err);

         // if no user is found, return the message
         if(!user) {
           res.status(401).send();
           return;
         }
         // if the user is found, but the password is wrong
         if(user.password != userToken.password) {
           res.status(401).send();
           return;
         }
         req.user = user;
         next();
       });
     });
   } else {
     console.log('No hay token');
     res.status(401).send();
   }
 };
