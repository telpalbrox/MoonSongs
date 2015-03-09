// app/controlers/songs.controllers.js
console.log('loading song controller');

/**
* Module dependencies
*/
var Song = require('../models/song.js'),
async = require('async'),
path = require('path'),
fs = require('fs');
var musicDir = path.dirname(__dirname)+'/music';
exports.list = function(req, res) {
  Song.find().sort({'album' : 1, 'title' : 1,}).exec(function(err, songs) {
    res.json(songs);
  });
};

exports.read = function(req, res) {
  if(!req.user.permissions.canListen) {
    res.send(401);
    return;
  }
  Song.findOne( { '_id' : req.params.id } , function(err, song) {
    if(err) res.send(err);
    res.json(song);
  });
};

exports.ckeck = function(req, res) {
  if(!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }
  Song.findOne( {
    'artist' : req.query.artist,
    'album' : req.query.album,
    'title' : req.query.title
  } , function(err, song) {
    if(err) res.send(err);
    if(song) res.send(true);
    else res.send(false);
  });
};

exports.delete = function(req, res) {
  if(!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }
  var artist = req.query.artist;
  var album = req.query.album;
  var title = req.query.title;
  Song.findOne( {
    'artist' : artist,
    'album' : album,
    'title' : title
  }).remove( function(err, numberAffected, raw) {
    if(err) res.send(err);
    if(numberAffected === 0) res.send(404, 'Cancion no encontrada');
    var fileSong = 'music/'+artist+'/'+album+'/'+title+'.mp3';
    fs.unlink(fileSong, function(error) {
      res.send(200);
    });
  } );
};

exports.albums = function(req, res) {
  if(!req.user.permissions.canListen) {
    res.send(401);
    return;
  }

  var albums = {};

  Song.find({}, function(err, songs) {
    for(var j in songs) {
      if(albums[songs[j].album] === undefined) {
        albums[songs[j].album] = {
          'album': songs[j].album,
          'artist': songs[j].artist,
          'songs': []
        };
      }
      albums[songs[j].album].songs.push(songs[j]);
    }
    var arrAlbums = [];
    for(var key in albums) {
      if(albums.hasOwnProperty(key)) {
        arrAlbums.push(albums[key]);
      }
    }
    res.json(arrAlbums);
  });
};
