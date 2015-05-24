// app/songs.routes.js
var songs = require('../controllers/songs');
var jwtauth = require('../middleware/jwtauth');

module.exports = function(app) {
  app.route('/api/songs')
    .get(jwtauth.allowUserType('canListen'), songs.list);

  app.route('/api/songs/:id')
    .get(jwtauth.allowUserType('canListen'), songs.read)
    .delete(jwtauth.allowUserType('canUpload'), songs.delete)
    .put(songs.update);

  app.route('/api/songs/:artist/:album/:title/info')
    .get(jwtauth.allowUserType('canListen'), songs.read);

  app.route('/api/albums')
    .get(jwtauth.allowUserType('canListen'), songs.albums);

  app.route('/api/songs/:artist/:album/:title/listen')
    .get(songs.listen);

  app.get('/api/songs/:artist/image', songs.imageArtist);

  app.get('/api/songs/:artist/:album/image', songs.imageCover);
};
