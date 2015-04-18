// app/utils/songUtils.js
console.log('loading songs utils...');

var shelljs = require('shelljs');
var q = require('q');
var fs = require('fs');
var path = require('path');
var request = require('request');
var id3 = require('id3-writer');
var mongoose = require('mongoose');
var Song = mongoose.model('Song');

var acoustidApiKey = 'cSpUJKpD';
var lastfmApiKey = 'b6eea2a4758396a9c5369fa6938d0d7e';
var version = require('../../package.json').version;

/**
 * Gets duration
 * @param {string} fileRoute
 * @returns {Promise} with Object that contains duration and fingerPrint properties
 */
exports.getSongFingerPrint = function(fileRoute) {
  var deferred = q.defer();
  shelljs.exec('fpcalc ' + '"' + fileRoute + '"', {
    silent: true,
    aync: true
  }, function(code, output) {
    output = output.replace(/\r/g, '');
    if(output.substr(0, 4) == 'ERROR') {
      throw new Error('Error executing fpcalc');
    }
    var commandLines = output.split('\n');
    var duration = commandLines[1].split('=')[1];
    var fingerPrint = commandLines[2].split('=')[1];
    var info = {
      'duration': duration,
      'fingerPrint': fingerPrint
    };
    deferred.resolve(info);
  });
  return deferred.promise;
};

/**
 * Get song RID for make musicBrainz query
 * @param {String} duration
 * @param {String} fingerPrint
 * @returns {Promise} with rid if exits or null if not exits
 */
exports.getSongRid = function(duration, fingerPrint) {
  if(!duration || !fingerPrint) throw new Error('Duration and figerPrint must be defined');
  var deferred = q.defer();
  var requestRid = {
    url: 'http://api.acoustid.org/v2/lookup?client=' + acoustidApiKey + '&meta=recordingids&duration=' + duration + '&fingerprint=' + fingerPrint,
    json: true
  };
  request(requestRid, function(error, response, body) {
    if (error || !body) throw new Error(error);
    var rid = null;
    if (body.results.length !== 0) {
      rid = body.results[0].recordings[0].id;
    }
    // console.log('rid: ' + rid);
    deferred.resolve(rid);
  });
  return deferred.promise;
};

/**
 * Find tags for a song
 * @param {String} rid
 * @param {String} fileName
 * @param {String} fileUploadName
 * @param {String} filePath
 * @returns {Promise} with Object that contains tags
 */
exports.findTags = function(rid, fileName, fileUploadName, filePath) {
  var deferred = q.defer();
  var unknownTags = {
    artist: 'Unknown',
    album: 'Unknown',
    title: fileUploadName,
    year: '1978',
    track: 0,
    genre: 'Unknown',
    'fileName': fileName,
    autoTaged: true
  };
  unknownTags.path = filePath || path.resolve(__dirname, '../../music') + '/' + unknownTags.artist + '/' + unknownTags.album + '/' + unknownTags.title + '.mp3';

  if (rid === null) {
    return q.fcall(function() {
      return unknownTags;
    });
  }

  var requestTag = {
    url: 'http://musicbrainz.org/ws/2/recording/' + rid + '?inc=artist-credits+isrcs+releases&fmt=json',
    headers: {
      'User-Agent': 'MoonSongs/0.0.4 ( alberto.luna.95@gmail.com )'
    },
    json: true
  };
  // console.log(requestTag.url);
  request(requestTag, function(error, response, body) {
    var tags = null;
    var releaseId = "";
    if(error) throw new Error();
    if (!error && response.statusCode === 200) {
      // console.log('titulo: ' + body.title);
      // console.log('album: ' + body.releases[0].title);
      // console.log('artista: ' + body['artist-credit'][0].name);
      tags = {
        artist: body['artist-credit'][0].name,
        album: body.releases[0].title,
        title: body.title,
        genre: 'Unknown', // musicbrainz don't provide genre info
        'fileName': fileName,
        autoTaged: true
      };
      tags.path = filePath || 'music/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
      releaseId = body.releases[0].id;
      // obtain track number and year
      var requestTrackYear = {
        url: 'http://musicbrainz.org/ws/2/release/' + releaseId + '?inc=artist-credits+labels+discids+recordings&fmt=json',
        headers: {
          'User-Agent': 'MoonSongs/' + version + ' ( alberto.luna.95@gmail.com )'
        },
        json: true
      };
      // console.log(requestTrackYear.url);
      request(requestTrackYear, function(error, response, body) {
        if(error) throw new Error();
        if (!error && response.statusCode === 200) {
          tags.year = new Date(body.date).getFullYear();
          tags.track = -1;
          var tracks = body.media[0].tracks;
          for (var j in tracks) {
            if (tags.title === tracks[j].title) {
              tags.track = tracks[j].number;
              // console.log('numero de pista para ' + tags.title + ': ' + tags.track);
              // console.log('anio: ' + tags.year);
              break;
            }
          }
          if (tags.track === -1) {
            tags.track = 0;
          }

          deferred.resolve(tags);
        } else {
          // console.log('error al recibir track number');
          tags.track = 0;
          deferred.resolve(tags);
        }
      });
    } else {
      // console.log('error al recibir tags');
      // console.log(error);
      deferred.resolve(unknownTags);
    }
  });
  return deferred.promise;
};

/**
 * Get song tags, if tags aren't passed they were sought on internet
 * @param {Object} tags
 * @param {String} fileRoute
 * @param {Boolean} uploaded
 * @returns {Promise} with tags
 */
exports.getSongTags = function(tags, fileRoute, uploaded) {
  var deferred = q.defer();
  if (!tags.artist || !tags.album || !tags.title) {
    exports.getSongFingerPrint(fileRoute)
      .then(function(info) {
        return exports.getSongRid(info.duration, info.fingerPrint);
      })
      .then(function(rid) {
        if (uploaded) return exports.findTags(rid, tags.fileName, tags.fileUploadName);
        else return exports.findTags(rid, tags.fileName, tags.fileUploadName, fileRoute);
      })
      .then(function(requestedTags) {
        return deferred.resolve(requestedTags);
      });
  } else {
    return q.fcall(function() {
      if (uploaded) tags.path = path.resolve(__dirname, '../../music') + '/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
      else tags.path = fileRoute;
      return tags;
    });
  }

  return deferred.promise;
};

function downloadImageCover(tags, path) {
  var urlGetAlbumInfo = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + lastfmApiKey + '&artist=' + tags.artist + '&album=' + tags.album + '&format=json';
  request({
    url: urlGetAlbumInfo,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.album && body.album.image[4]['#text']) {
      request(body.album.image[4]['#text']).pipe(fs.createWriteStream(path));
    } else {
      fs.createReadStream('assets/Album.jpg').pipe(fs.createWriteStream(path));
    }
  });
}

function downloadImageArtist(tags, path) {
  var urlGetArtistInfo = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' + lastfmApiKey + '&artist=' + tags.artist + '&format=json';
  request({
    url: urlGetArtistInfo,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.artist && body.artist.image[4]['#text']) {
      request(body.artist.image[4]['#text']).pipe(fs.createWriteStream(path));
    } else {
      fs.createReadStream('assets/Artist.jpg').pipe(fs.createWriteStream(path));
    }
  });
}

exports.downloadImages = function(tags) {
  console.log('descargando imagenes');
  var imageArtistPath = 'music/' + tags.artist + '/Artist.jpg';
  var imageCoverPath = 'music/' + tags.artist + '/' + tags.album + '/Cover.jpg';

  fs.exists(imageCoverPath, function(exits) {
    if (!exits) downloadImageCover(tags, imageCoverPath);
  });
  fs.exists(imageArtistPath, function(exits) {
    if (!exits) downloadImageArtist(tags, imageArtistPath);
  });
};

exports.writeTags = function(tags, fileRoute) {
  var deferred = q.defer();
  var file = fileRoute || 'music/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
  var writerId3 = new id3.Writer();
  var metaId3 = new id3.Meta({
    title: tags.title,
    album: tags.album,
    artist: tags.artist
  });
  writerId3.setFile(new id3.File(file)).write(metaId3, function(err) {
    if(err) {
      console.log(err);
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};

exports.saveSong = function(tags) {
  var deferred = q.defer();
  var newSong = new Song();
  newSong.artist = tags.artist;
  newSong.album = tags.album;
  newSong.title = tags.title;
  newSong.year = tags.year;
  newSong.track = tags.track;
  newSong.genre = tags.genre;
  newSong.path = tags.path;
  newSong.listens = 0;
  newSong.found = true;
  newSong.save(function(err) {
    deferred.resolve();
  });
  return deferred.promise;
};

exports.moveSongToFolder = function(tags) {
  var deferred = q.defer();
  var sourcePath = 'uploads/' + tags.fileName;
  var destPath = 'music/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
  var source = fs.createReadStream(sourcePath);
  var dest = fs.createWriteStream(destPath);

  source.pipe(dest);
  source.on('end', function() {
    deferred.resolve();
  });
  source.on('error', function() {
    deferred.reject();
  });

  return deferred.promise;
};

exports.createAlbumFolder = function(tags) {
  var deferred = q.defer();
  fs.mkdir('music/' + tags.artist + '/' + tags.album, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
};

exports.createArtistFolder = function(tags) {
  var deferred = q.defer();
  fs.mkdir('music/' + tags.artist, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
};
