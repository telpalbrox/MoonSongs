// app/songs.routes.js
console.log('loading songs routes...');

var songs = require('../controllers/songs.controller.js');
var jwtauth = require('../../config/jwtauth.js');

module.exports = function(app) {
  app.route('/api/songs')
    .get(jwtauth.allowOnlyListen, songs.list);

  app.route('/api/songs/:id')
    .get(jwtauth.allowOnlyListen, songs.read);

  app.route('/api/songs/?')
    .delete(jwtauth.allowOnlyUpload, songs.delete);

  app.route('/api/checkSong?')
    .get(jwtauth.allowOnlyUpload, songs.check);

  app.route('/api/albums')
    .get(jwtauth.allowOnlyListen, songs.albums);
};
