// app/songs.routes.js
console.log('loading songs routes...');

var songs = require('../controllers/songs.controller.js');
var jwtauth = require('../../config/jwtauth.js');

module.exports = function(app) {
  app.route('/private/songs')
    .get(jwtauth.allowOnlyListen, songs.list);

  app.route('/private/songs/:id')
    .get(jwtauth.allowOnlyListen, songs.read);

  app.route('/private/songs/?')
    .delete(jwtauth.allowOnlyUpload, songs.delete);

  app.route('/private/checkSong?')
    .get(jwtauth.allowOnlyUpload, songs.check);

  app.route('/private/albums')
    .get(jwtauth.allowOnlyListen, songs.albums);
};
