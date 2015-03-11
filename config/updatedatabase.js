// config/updatedatabase.js
console.log('updating database');

var Song = require('../app/models/song.js');
var User = require('../app/models/user.js');
var songUtils = require('../app/utils/songUtils.js');
var path = require('path');
var async = require('async');
var id3 = require('id3js');
var fs = require('fs');
var q = require('q');
var walk    = require('walk');

function endHandler() {
  User.find({}, function(err, users) {
    if(users.length !== 0) {
      console.log('Hay creados '+users.length+' usuarios');
    } else {
      console.log('No hay usuarios creados, creando admin');
      newUser = new User();
      newUser.email = 'admin@localhost';
      newUser.userName = 'admin';
      newUser.password = newUser.generateHash('patata');
      newUser.admin = true;
      newUser.permissions.canUpload = true;
      newUser.permissions.canListen = true;
      newUser.save(function(err) {});
    }
  });
}

function fileHandler(root, fileStat, next) {
  if(fileStat.name.substring(fileStat.name.length-3, fileStat.name.length) != 'mp3') {
    next();
    return;
  }
  var fileRoute = root+'/'+fileStat.name;
  console.log(fileRoute);
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

    songUtils.getSongTags(tags, fileRoute, false)
    .then(function(requestedTags) {
      tags = requestedTags;
      return songUtils.createArtistFolder(tags);
    })
    .then(function() {
      return songUtils.createAlbumFolder(tags);
    })
    .then(function() {
      if(tags.autoTaged) return songUtils.writeTags(tags, fileRoute);
    })
    .then(function() {
      songUtils.downloadImages(tags);
      return songUtils.saveSong(tags);
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
  var walker  = walk.walk('music', { followLinks: false, filters: [".cache"] });
  walker.on("file", fileHandler);
  walker.on("end", endHandler);
};
