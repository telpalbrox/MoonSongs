// app/user.routes.js
console.log('loading user routes...');

var users = require('../controllers/users.controller.js');

module.exports = function(app) {
  app.route('/public/users')
  .post(users.create);

  app.route('/private/users')
  .get(users.list);

  app.route('/private/users/:id')
  .get(users.read)
  .put(users.update)
  .delete(users.delete);
}
