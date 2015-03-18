// app/controllers/songs.controllers.js
console.log('loading song controller');

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Song = mongoose.model('Song'),
  path = require('path'),
  fs = require('fs');

exports.list = function(req, res) {
  Song.find().sort({
    'album': 1,
    'title': 1
  }).exec(function(err, songs) {
    if(songs.length === 0) {
      res.status(404).send();
      return;
    }
    res.json(songs);
  });
};

exports.read = function(req, res) {
  if (!req.user.permissions.canListen) {
    res.send(401);
    return;
  }
  Song.findOne({
    '_id': req.params.id
  }, function(err, song) {
    if (err) {
      console.log(err);
      res.status(501).send();
      return;
    }
    if (!song) {
      res.status(404).send();
      return;
    }
    res.json(song);
  });
};

exports.check = function(req, res) {
  if (!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }
  Song.findOne({
    'artist': req.query.artist,
    'album': req.query.album,
    'title': req.query.title
  }, function(err, song) {
    if (err) res.status(501).send();
    if (song) res.status(200).send();
    else res.status(404).send();
  });
};

exports.delete = function(req, res) {
  if (!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }
  var artist = req.query.artist;
  var album = req.query.album;
  var title = req.query.title;
  Song.findOne({
    'artist': artist,
    'album': album,
    'title': title
  }, function(err, song) {
    if (!song) {
      res.status(404).send('Cancion no encontrada');
      return;
    }
    song.remove(function(err, song) {
      if (err) {
        console.log(err);
        res.status(501).send('Error al borrar la cancion');
        return;
      } else {
        fs.unlink(song.path, function(err) {
          if (err && process.env.NODE_ENV != 'test') {
            console.log(err);
            res.status(501).send('Error al borrar la cancion');
            return;
          }
          res.status(200).send();
          return;
        });
      }
    });
  });
};

exports.albums = function(req, res) {
  if (!req.user.permissions.canListen) {
    res.send(401);
    return;
  }

  var albums = {};

  Song.find({}, function(err, songs) {
    if (songs.length === 0) {
      res.status(404).send();
      return;
    }
    for (var j in songs) {
      if (albums[songs[j].album] === undefined) {
        albums[songs[j].album] = {
          'album': songs[j].album,
          'artist': songs[j].artist,
          'songs': []
        };
      }
      albums[songs[j].album].songs.push(songs[j]);
    }
    var arrAlbums = [];
    for (var key in albums) {
      if (albums.hasOwnProperty(key)) {
        arrAlbums.push(albums[key]);
      }
    }
    res.json(arrAlbums);
  });
};
