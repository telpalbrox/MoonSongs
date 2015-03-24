// app/user.routes.js
console.log('loading user routes...');

var jwtauth = require('../../config/jwtauth.js');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  app.route('/public/users')
    .post(jwtauth.allowOnlyAdmin, users.create);

  app.route('/private/users')
    .get(jwtauth.allowOnlyAdmin, users.list);

  app.route('/private/users/:id')
    .get(jwtauth.allowOnlyAdmin, users.read)
    .put(jwtauth.allowOnlyAdmin, users.update)
    .delete(jwtauth.allowOnlyAdmin, users.delete);
};
