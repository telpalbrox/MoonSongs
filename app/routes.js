// routes.js
console.log('loading routes...');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');

var SECRET = "albertoesmuylol";

module.exports = function(app) {

  // We are going to protect /private routes with JWT
  //app.use('/private', expressJwt({secret: SECRET}));

  // load user routes
  require('../app/routes/users.routes.js')(app);
  // load song routes
  require('../app/routes/songs.routes.js')(app);
  // load uploads routes
  require('../app/routes/uploads.routes.js')(app);

  // TOKEN
  app.post('/api/authenticate', function(req, res) {
    mainLogger.trace('[File: routes.js] | ' +
    '[Route POST /api/authenticate] | ' +
    '[Function anonymous] | ' +
    '[User id: ' + ( req.user ? req.user._id : 0) + ']');
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login alredy exits
    var userName = req.body.userName;
    var password = req.body.password;
    if(!userName || !password) {
      return res.send(400).send('Need pass userName and password');
    }
    
    authLogger.info('[Attempting login: ' + userName +'] | ' +
    '[Request from: ' + ( req.user ? req.user._id : 0) +']');
    
    User.findOne({
      'userName': req.body.userName
    }, function(err, user) {
      // if there ar any erros, return the error before anything else
      if (err) {
        errorLogger.error('Error getting user');
        return res.status(500).send();
      }

      // if no user is found, return the message
      if (!user) {
        authLogger.warn('[Attempting login: ' + userName +'] | ' +
        '[Failed: wrong user]');
        res.status(400).send('Unauthorized request, wrong user');
        return;
      }

      // if the user is found, but the password is wrong
      if (!user.validPassword(req.body.password)) {
        authLogger.warn('[Attempting login: ' + userName +'] | ' +
        '[Failed: wrong pass]');
        res.status(400).send('Unauthorized request, wrong pass');
        return;
      }
      
      var token = jwt.sign(user, SECRET);
      // console.log(token);
      res.json({
        'token': token
      });
    });
  });
};
