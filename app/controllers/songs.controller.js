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

  var jsonAlbums = [];
  var arrAlbums;

  var function1 = function(item, callback) {
    Song.findOne({'album' : item }, function(err, song) {
      jsonAlbums.push({
        'album' : item,
        'artist' : song.artist,
        'songs' : []
      });
      callback();
    });
  };

  async.series([function(callback) {
    Song.distinct('album', function(err, albums) {
      if(err) res.send(err);
      arrAlbums = albums;
      async.eachSeries(arrAlbums, function1, function() {
        Song.find({}, function(err, songs) {
          for(var j in songs) {
            for(var k in jsonAlbums) {
              if(songs[j].album == jsonAlbums[k].album) {
                jsonAlbums[k].songs.push(songs[j]);
              }
            }
          }
          res.json(jsonAlbums);
          callback();
        });
      });
      callback();
    });
  }]);
};
