// app/songs.routes.js
console.log('loading songs routes...');

var songs = require('../controllers/songs.controller.js');

module.exports = function(app) {
  app.route('/private/songs')
    .get(songs.list);

  app.route('/private/songs/:id')
    .get(songs.read);

  app.route('/private/songs/?')
    .delete(songs.delete);

  app.route('/private/checkSong?')
    .get(songs.check);

  app.route('/private/albums')
    .get(songs.albums);
};
