// app/songs.routes.js
console.log('loading songs routes...');

var songs = require('../controllers/songs.controller.js');
var jwtauth = require('../middleware/jwtauth');

module.exports = function(app) {
  app.route('/api/songs')
    .get(jwtauth.allowUserType('canListen'), songs.list);

  app.route('/api/songs/:id')
    .get(jwtauth.allowUserType('canListen'), songs.read)
    .delete(jwtauth.allowUserType('canUpload'), songs.delete);

  app.route('/api/songs/:artist/:album/:title')
    .get(jwtauth.allowUserType('canListen'), songs.read)
    .delete(jwtauth.allowUserType('canUpload'), songs.delete);

  app.route('/api/albums')
    .get(jwtauth.allowUserType('canListen'), songs.albums);

  app.route('/api/songs/listen/:artist/:album/:title')
    .get(songs.listen);
};
