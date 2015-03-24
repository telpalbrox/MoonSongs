// app/user.routes.js
console.log('loading user routes...');

var jwtauth = require('../../config/jwtauth.js');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  app.route('/api/users')
    .post(users.create);

  app.route('/api/users')
    .get(jwtauth.allowOnlyAdmin, users.list);

  app.route('/api/users/:id')
    .get(jwtauth.allowOnlyAdmin, users.read)
    .put(jwtauth.allowOnlyAdmin, users.update)
    .delete(jwtauth.allowOnlyAdmin, users.delete);
};
