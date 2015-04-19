// app/controllers/uploads.controllers.js
var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');

var q = require('q');
var fs = require('fs');
var request = require('request');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var songLib = require('../libs/song.lib.js');

exports.upload = function(req, res) {
  mainLogger.trace('[File: uploads.controller.js] | ' +
  '[Route POST /api/upload] | ' +
  '[Function upload] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var tags = JSON.parse(req.body.info);
  tags.fileName = req.files.file.name;

  songLib.getSongTags(tags, 'uploads/' + tags.fileName, true)
    .then(function(requestedTags) {
      tags = requestedTags;
      return songLib.createArtistFolder(tags);
    })
    .then(function() {
      return songLib.createAlbumFolder(tags);
    })
    .then(function() {
      return songLib.moveSongToFolder(tags);
    })
    .then(function() {
      return songLib.writeTags(tags);
    })
    .then(function() {
      songLib.downloadImages(tags);
      return songLib.saveSong(tags);
    })
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(err) {
      errorLogger.error('[Error uploading song] | ' +
      '[Error: ' + err + ']');
      res.status(501).send('Error al subir la cancion');
    });
};
