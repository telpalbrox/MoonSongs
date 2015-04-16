// app/controllers/uploads.controllers.js
console.log('loading uploads controller...');

var q = require('q');
var fs = require('fs');
var request = require('request');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var songUtils = require('../utils/songUtils.js');

exports.upload = function(req, res) {
  var tags = JSON.parse(req.body.info);
  tags.fileName = req.files.file.name;

  songUtils.getSongTags(tags, 'uploads/' + tags.fileName, true)
    .then(function(requestedTags) {
      tags = requestedTags;
      return songUtils.createArtistFolder(tags);
    })
    .then(function() {
      return songUtils.createAlbumFolder(tags);
    })
    .then(function() {
      return songUtils.moveSongToFolder(tags);
    })
    .then(function() {
      return songUtils.writeTags(tags);
    })
    .then(function() {
      songUtils.downloadImages(tags);
      return songUtils.saveSong(tags);
    })
    .then(function() {
      res.sendStatus(201);
    })
    .fail(function(error) {
      console.log(error);
      res.status(501).send('Error al subir la cancion');
    });
};
