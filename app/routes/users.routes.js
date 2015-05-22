// app/user.routes.js
console.log('loading user routes...');

var jwtauth = require('../middleware/jwtauth');
var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  app.route('/api/users')
    .post(users.create);

  app.route('/api/users')
    .get(jwtauth.allowUserType('admin'), users.list);

  app.route('/api/users/:id')
    .get(jwtauth.allowAllUsers, users.read)
    .put(jwtauth.allowAllUsers, users.update)
    .delete(jwtauth.allowUserType('admin'), users.delete);
};
