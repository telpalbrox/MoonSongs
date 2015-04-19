// config/updatedatabase.js
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var User = mongoose.model('User');
var songLib = require('../app/libs/song.lib.js');
var path = require('path');
var id3 = require('id3js');
var fs = require('fs');
var q = require('q');
var walk    = require('walk');
var packageJson = require('../package.json');

function endHandler() {
  Song.find({}, function(err, songs) {
    if(err) {
      errorLogger.error('[Error creating admin user] | ' +
      '[Error: ' + err +']');
      return;
    }
    mainLogger.info('[Finished scaning music folder, found ' + songs.length + ' songs]');
  });
  User.find({}, function(err, users) {
    if(err) {
      errorLogger.error('[Error finding users] | ' +
      '[Error: ' + err +']');
      return;
    }
    if(users.length !== 0) {
      mainLogger.info('[There is created ' + users.length +' users]');
    } else {
      authLogger.info('[Creating admin user]');
      var newUser = new User();
      newUser.email = 'admin@localhost';
      newUser.userName = 'admin';
      newUser.password = newUser.generateHash('patata');
      newUser.permissions.canUpload = true;
      newUser.permissions.canListen = true;
      newUser.permissions.admin = true;
      newUser.save(function(err) {
        if(err) {
          errorLogger.error('[Error creating admin user] | ' +
          '[Error: ' + err +']');
          return;
        }
        authLogger.info('[Successful created admin user]');
      });
    }
  });
}

function fileHandler(root, fileStat, next) {
  if(fileStat.name.substring(fileStat.name.length-3, fileStat.name.length) != 'mp3') {
    next();
    return;
  }
  var fileRoute = path.join(root, fileStat.name);
  // console.log(fileRoute);
  id3({ file: fileRoute, type: id3.OPEN_LOCAL }, function(err, tags) {
    if(err) {
      errorLogger.error('[Error getting song tags] | ' +
      '[File: ' + fileRoute + '] | ' +
      '[Error: ' + err + ']');
      next();
    }

    if(tags.title) tags.title = tags.title.replace(/\0/g, '');
    if(tags.album) tags.album = tags.album.replace(/\0/g, '');
    if(tags.artist) tags.artist = tags.artist.replace(/\0/g, '');
    if(tags.year) tags.year = tags.year.replace(/\0/g, '');
    if(tags.v1.genre) tags.genre = tags.v1.genre.replace(/\0/g, '');
    if(tags.v1.track) tags.track = tags.v1.track;
    tags.fileUploadName = fileStat.name;
    tags.path = fileRoute;

    songLib.getSongTags(tags, fileRoute, false)
      .then(function(requestedTags) {
        tags = requestedTags;
        return songLib.createArtistFolder(tags);
      })
      .then(function() {
        return songLib.createAlbumFolder(tags);
      })
      .then(function() {
        if(tags.autoTaged) return songLib.writeTags(tags, fileRoute);
      })
      .then(function() {
        songLib.downloadImages(tags);
        return songLib.saveSong(tags);
      })
      .then(function() {
        next();
      })
      .fail(function(err) {
        errorLogger.error('[Error adding song] | ' +
        '[File: ' + fileRoute + '] | ' +
        '[Error: ' + err + ']');
        next();
      });
  });
}

module.exports = function() {
  var musicDir = packageJson.config.musicFolder;
  var walker  = walk.walk(musicDir, { followLinks: false, filters: [".cache"] });
  mainLogger.trace('[File: updatedatabase.js] | ' +
  '[Music folder: ' + musicDir + ']');
  Song.remove({}, function(err) {
    if(err) {
      errorLogger.error('[Error deleting songs] | ' +
      '[Error: ' + err +']');
    }
  });

  walker.on("file", fileHandler);
  walker.on("end", endHandler);
};
