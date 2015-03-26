// app/songs.routes.js
console.log('loading songs routes...');

var songs = require('../controllers/songs.controller.js');
var jwtauth = require('../middleware/jwtauth');

module.exports = function(app) {
  app.route('/api/songs')
    .get(jwtauth.allowUserType('canListen'), songs.list);

  app.route('/api/songs/:id')
    .get(jwtauth.allowUserType('canListen'), songs.read);

  app.route('/api/songs/?')
    .delete(jwtauth.allowUserType('canUpload'), songs.delete);

  app.route('/api/checkSong?')
    .get(jwtauth.allowUserType('canUpload'), songs.check);

  app.route('/api/albums')
    .get(jwtauth.allowUserType('canListen'), songs.albums);
};
