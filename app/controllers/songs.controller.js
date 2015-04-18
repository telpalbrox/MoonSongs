// app/controllers/songs.controllers.js
console.log('loading song controller');

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Song = mongoose.model('Song'),
  path = require('path'),
  fs = require('fs'),
  im = require('imagemagick');

var packageJson = require('../../package.json');
var musicFolder = packageJson.config.musicFolder;

/**
 * Get find parameters form request
 * @param req
 * @returns {Object|null}
 */
function getFindParams(req) {
  var id = req.params.id;
  if(!id) {
    var title = req.params.title;
    var album = req.params.album;
    var artist = req.params.artist;
    if(!title || !album || !artist) {
      return null;
    } else {
      return {
        'title': title,
        'album': album,
        'artist': artist
      };
    }
  } else {
    return {
      '_id': id
    };
  }
}

exports.list = function(req, res) {
  Song.find({}).sort({
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
  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
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
  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
    if (err) res.status(501).send();
    if (song) res.status(200).send();
    else res.status(404).send();
  });
};

exports.delete = function(req, res) {
  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
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

exports.listen = function(req, res) {
  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
    if(err) return res.status(500).send('Error al buscar la cancion');
    if(!song) return res.status(404).send('nosta');
    res.sendFile(song.path, function(err) {
      if(err) {
        console.log(err);
        // return res.status(500).send('Error al enviar la cancion');
      }
    });
  });
};

exports.imageCover = function(req, res) {
  var album = req.params.album;
  var artist = req.params.artist;

  var height = 256 || req.query.height;
  var width = 256 || req.query.width;
  var file = musicFolder + '/' + artist + '/' + album + '/Cover.jpg';
  var fileCroped = musicFolder + '/' + artist + '/' + album + '/Cover.' + height + '.' + width + '.jpg';

  fs.exists(file, function(exits) {
    if(!exits) {
      return res.sendStatus(404);
    }
    fs.exists(fileCroped, function(exists) {
      if(exists) {
        res.sendFile(fileCroped, function(err) {
          if(err) console.log(err);
        });
      } else {
        var options = {
          srcPath: file,
          dstPath: fileCroped,
          height: height,
          width: width
        };
        im.resize(options, function(err) {
          if(err) {
            return res.sendStatus(500);
          }
          res.sendFile(fileCroped, function(err) {
            if(err) console.log(err);
          });
        });
      }
    });
  });
};

exports.imageArtist = function(req, res) {
  var artist = req.params.artist;

  var height = 256 || req.query.height;
  var width = 256 || req.query.width;
  var file = musicFolder + '/' + artist + '/Artist.jpg';
  var fileCroped = musicFolder + '/' + artist + '/Artist.' + height + '.' + width + '.jpg';

  fs.exists(file, function(exits) {
    if(!exits) {
      return res.sendStatus(404);
    }
    fs.exists(fileCroped, function(exists) {
      if(exists) {
        res.sendFile(fileCroped, function(err) {
          if(err) console.log(err);
        });
      } else {
        var options = {
          srcPath: file,
          dstPath: fileCroped,
          height: height,
          width: width
        };
        im.resize(options, function(err) {
          if(err) {
            return res.sendStatus(500);
          }
          res.sendFile(fileCroped, function(err) {
            if(err) console.log(err);
          });
        });
      }
    });
  });
};
