// config/updatedatabase.js
console.log('updating database');

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
  User.find({}, function(err, users) {
    if(users.length !== 0) {
      // console.log('Hay creados '+users.length+' usuarios');
    } else {
      console.log('No hay usuarios creados, creando admin');
      var newUser = new User();
      newUser.email = 'admin@localhost';
      newUser.userName = 'admin';
      newUser.password = newUser.generateHash('patata');
      newUser.permissions.canUpload = true;
      newUser.permissions.canListen = true;
      newUser.permissions.admin = true;
      newUser.save(function(err) {});
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
      console.log('Error al procesar: ' + fileRoute);
      console.log(err);
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
    .fail(function(error) {
      console.log(error);
      console.log('Error al aniadir la cancion');
      next();
    });
  });
}

module.exports = function(fs) {
  Song.remove({}, function(err) {

  });

  var musicDir = packageJson.config.musicFolder;
  var walker  = walk.walk(musicDir, { followLinks: false, filters: [".cache"] });
  walker.on("file", fileHandler);
  walker.on("end", endHandler);
};
