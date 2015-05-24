var log4js = require('log4js');
var async = require('async');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var songLib = require('../libs/song.lib');
var Boom = require('boom');
var rimraf = require('rimraf');
// app/controllers/songs.controllers.js
/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Song = mongoose.model('Song'),
  path = require('path'),
  fs = require('fs'),
  im = require('imagemagick');

var packageJson = require('../../package.json');
var musicFolder = path.resolve(packageJson.config.musicFolder);

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
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/songs] | ' +
  '[Function list] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  Song.find({}).sort({
    'album': 1,
    'title': 1
  }).exec(function(err, songs) {
    if(err) {
      errorLogger.error('Error getting songs');
      errorLogger.error(err);
      res.sendStatus(500);
      return;
    }
    res.json(songs);
  });
};

exports.read = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/songs/' + req.params.id + '] | ' +
  '[Function read] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
    if (err) {
      errorLogger.error('Error getting song');
      errorLogger.error(err);
      res.status(500).send();
      return;
    }
    if (!song) {
      res.status(404).send();
      return;
    }
    res.json(song);
  });
};

exports.delete = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route DELETE /api/songs/' + req.params.id + '] | ' +
  '[Function delete] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  async.waterfall([
      function(callback) {
        // check if song exists
        Song.findOne(findParams, function(err, song) {
          if(err) {
            return callback({
              response: Boom.badImplementation('Server error finding song'),
              error: err
            });
          }
          if(!song) {
            return callback({
              response: Boom.notFound('Song not found')
            });
          }
          callback(null, song);
        });
      },
    function(song, callback) {
      // remove song from database
      song.remove(function(err) {
        if(err) {
          return callback({
            response: Boom.badImplementation('Error deleting song'),
            error: err
          });
        }
        callback(null, song);
      });
    }, function(song, callback) {
      // If there is not any song with that artist remove artist folder
      Song.find({ artist: song.artist }, function(err, songs) {
        if(err) {
          return callback({
            response: Boom.badImplementation('Server error finding songs by artist'),
            error: err
          });
        }
        if(!songs.length) {
          rimraf(musicFolder + '/' + song.artist, function(err) {
            if(err) {
              return callback({
                response: Boom.badImplementation('Server deleting artist song folder'),
                error: err
              });
            }
            callback(null, null);
          });
        } else {
          callback(null, song);
        }
      });
    }, function(song, callback) {
      // If there is not any song with that album remove album folder
      if(!song) {
        return callback(null, null);
      }

      Song.find({ album: song.album}, function(err, songs) {
        if(err) {
          return callback({
            response: Boom.badImplementation('Server error finding songs by album'),
            error: err
          });
        }

        if(!songs.length) {
          rimraf(musicFolder + '/' + song.artist + '/' + song.album, function(err) {
            if(err) {
              return callback({
                response: Boom.badImplementation('Server deleting album song folder'),
                error: err
              });
            }
            callback(null, null);
          });
        } else {
          callback(null, song);
        }
      });
    }, function(song, callback) {
      if(!song) {
        return callback();
      }

      fs.unlink(song.path, function(err) {
        if(err) {
          return callback({
            response: Boom.badImplementation('Server deleting album song folder'),
            error: err
          });
        }
        callback();
      });
    }
  ], function(err) {
    if(err) {
      errorLogger.error('Error deletting song');
      errorLogger.log(err.error);
      return res.status(err.response.message).send(err.response);
    }
    res.sendStatus(204);
  });
};

exports.albums = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/albums/] | ' +
  '[Function albums] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var albums = {};

  Song.find({}, function(err, songs) {
    if(err) {
      errorLogger.error('Error getting albums');
      errorLogger.log(err);
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
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/songs/' + req.params.artist + '/' + req.params.album + '/' + req.params.title + '/listen] | ' +
  '[Function listen] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var findParams = getFindParams(req);
  if(!findParams) return res.status(400).send();

  Song.findOne(findParams, function(err, song) {
    if(err) {
      errorLogger.error('Error getting song');
      errorLogger.error(err);
      return res.status(500).send('Error al buscar la cancion');
    }
    if(!song) return res.status(404).send('nosta');
    mainLogger.info('[File: ' + song.path + ']');
    res.sendFile(song.path, function(err) {
      if(err) {
        errorLogger.error('Error sending song');
        errorLogger.error(err);
      }
    });
  });
};

exports.imageCover = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/songs/' + req.params.artist + '/' + req.params.album + '/image] | ' +
  '[Function imageCover] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var album = req.params.album;
  var artist = req.params.artist;

  var height = 256 || req.query.height;
  var width = 256 || req.query.width;
  var file = musicFolder + '/' + artist + '/' + album + '/Cover.jpg';
  var fileCroped = musicFolder + '/' + artist + '/' + album + '/Cover.' + height + '.' + width + '.jpg';

  mainLogger.info('[Height: ' + height + '] | ' +
  '[Width: ' + width +'] | ' +
  '[File: ' + file + '] | ' +
  '[FileCroped: ' + fileCroped +']');

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
        mainLogger.info('[Need resizing: ' + file + ']');
        im.resize(options, function(err) {
          if(err) {
            errorLogger.error('[Error resizing file: ' + file + '] | ' +
            '[Error: ' + err +']');
            return res.sendStatus(500);
          }
          mainLogger.info('[Resizing finished: ' + fileCroped + ']');
          res.sendFile(fileCroped, function(err) {
            if(err) console.log(err);
          });
        });
      }
    });
  });
};

exports.imageArtist = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
  '[Route GET /api/songs/' + req.params.artist + '/listen] | ' +
  '[Function imageArtist] | ' +
  '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  var artist = req.params.artist;

  var height = 256 || req.query.height;
  var width = 256 || req.query.width;
  var file = musicFolder + '/' + artist + '/Artist.jpg';
  var fileCroped = musicFolder + '/' + artist + '/Artist.' + height + '.' + width + '.jpg';

  mainLogger.info('[Height: ' + height + '] | ' +
  '[Width: ' + width +'] | ' +
  '[File: ' + file + '] | ' +
  '[FileCroped: ' + fileCroped +']');

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
        mainLogger.info('[Need resizing: ' + file + ']');
        im.resize(options, function(err) {
          if(err) {
            errorLogger.error('[Error resizing file: ' + file + '] | ' +
            '[Error: ' + err +']');
            return res.sendStatus(500);
          }
          mainLogger.info('[Resizing finished: ' + fileCroped + ']');
          res.sendFile(fileCroped, function(err) {
            if(err) console.log(err);
          });
        });
      }
    });
  });
};

exports.update = function(req, res) {
  mainLogger.trace('[File: songs.controller.js] | ' +
    '[Route PUT /api/songs/' + req.params.id + '] | ' +
    '[Function update] | ' +
    '[User id: ' + ( req.user ? req.user._id : 0) + ']');

  if(!req.params.id || !req.body.song) {
    res.sendStatus(400);
  }

  Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, song) {
    if(err) {
      errorLogger.error('Error getting song');
      errorLogger.error(err);
      return res.sendStatus(500);
    }

    if(!song) {
      return res.sendStatus(404);
    }

    songLib.writeTags(song, song.path)
      .then(function() {
        res.sendStatus(200);
      })
      .catch(function(err) {
        errorLogger.error('Error updating song tags of file: ' + song.path);
        errorLogger.error(err);
        res.sendStatus(500);
      });

  });


};
