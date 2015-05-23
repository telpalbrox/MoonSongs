// app/utils/songUtils.js
var log4js = require('log4js');
var debugLogger = log4js.getLogger('debug');
var errorLogger = log4js.getLogger('error');

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
var packageJson = require('../../package.json');
var version = packageJson.version;
var musicFolder = path.resolve(packageJson.config.musicFolder);

exports.getSongFingerPrint = getSongFingerPrint;
exports.getSongRid = getSongRid;
exports.findTags = findTags;
exports.getSongTags = getSongTags;
exports.downloadImages = downloadImages;
exports.writeTags = writeTags;
exports.saveSong = saveSong;
exports.moveSongToFolder = moveSongToFolder;
exports.createAlbumFolder = createAlbumFolder;
exports.createArtistFolder = createArtistFolder;

/**
 * Gets duration
 * @param {string} fileRoute
 * @returns {Promise} with Object that contains duration and fingerPrint properties
 */
function getSongFingerPrint(fileRoute) {
  var deferred = q.defer();
  var fingerCommand = 'fpcalc ' + '"' + fileRoute + '"';
  debugLogger.debug('[Getting song fingerprint] | ' +
  '[Command: ' + fingerCommand + '] | ' +
  '[Funciton: getSongFingerPrint]');
  shelljs.exec(fingerCommand, {
    silent: true,
    aync: true
  }, function(code, output) {
    debugLogger.debug('[Command: ' + fingerCommand + ' finished with code: ' + code + ']');
    output = output.replace(/\r/g, '');
    if(output.substr(0, 4) == 'ERROR') {
      errorLogger.error('[Error getting song fingerPrint] | ' +
      '[File: ' + fileRoute + ']' +
      '[Error: ' + output + ']');
      return deferred.reject('Error executing fpcalc');
    }
    var commandLines = output.split('\n');
    var duration = commandLines[1].split('=')[1];
    var fingerPrint = commandLines[2].split('=')[1];
    var info = {
      'duration': duration,
      'fingerPrint': fingerPrint
    };
    debugLogger.debug('[Fingerprint successful calculated]');
    deferred.resolve(info);
  });
  return deferred.promise;
}

/**
 * Get song RID for make musicBrainz query
 * @param {String} duration
 * @param {String} fingerPrint
 * @returns {Promise} with rid if exits or null if not exits
 */
function getSongRid(duration, fingerPrint) {
  if(!duration || !fingerPrint) throw new Error('Duration and figerPrint must be defined');
  var deferred = q.defer();
  var requestRid = {
    url: 'http://api.acoustid.org/v2/lookup?client=' + acoustidApiKey + '&meta=recordingids&duration=' + duration + '&fingerprint=' + fingerPrint,
    json: true
  };
  debugLogger.debug('[Getting song RID] | ' +
  '[Request url(partial): ' + requestRid.url.substr(0, 70) +'] | ' +
  '[Function: getSongRid]');
  request(requestRid, function(err, response, body) {
    if (err || !body) {
      errorLogger.error('[Error getting song RID] | ' +
      '[Error: ' + err + ']');
      return deferred.reject('Error getting song RID');
    }
    var rid = null;
    if (body.results.length !== 0 && body.results[0].recordings) {
      rid = body.results[0].recordings[0].id;
      debugLogger.debug('[RID successfully got, RID: ' + rid + ']');
    } else {
      debugLogger.warn('[Attemping get RID failed, song not recognized]');
    }
    deferred.resolve(rid);
  });
  return deferred.promise;
}

/**
 * Find tags for a song
 * @param {String} rid
 * @param {String} fileName
 * @param {String} fileUploadName
 * @param {String} filePath
 * @returns {Promise} with Object that contains tags
 */
function findTags(rid, fileName, fileUploadName, filePath) {
  debugLogger.debug('[Finding song tags] | ' +
  '[File: ' + filePath + '] | ' +
  '[Funciton: fingTags]');
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
      debugLogger.debug('[Unknow song] | ' +
      '[File: ' + unknownTags.path + ']');
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
  debugLogger.debug('[Requesting song info] | ' +
  '[Url: ' + requestTag.url + ']');
  request(requestTag, function(err, response, body) {
    var tags = null;
    var releaseId = "";
    if(err)  {
      errorLogger.error('[Error getting song tags from musicbrainz] | ' +
      '[Url: ' + requestTag.url + '] |' +
      '[Error: ' + err + ']');
      return deferred.reject('Error getting song tags from musicbrainz');
    }
    if (!err && response.statusCode === 200) {
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
      tags.path = filePath || musicFolder + '/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';

      debugLogger.debug('[Successfully got song tags] | ' +
      '[File: ' + tags.path + ']' +
      '[Artist: ' + tags.artist + '] | ' +
      '[Album: ' + tags.album + '] | ' +
      '[Title: ' + tags.title +']');

      releaseId = body.releases[0].id;
      // obtain track number and year
      var requestTrackYear = {
        url: 'http://musicbrainz.org/ws/2/release/' + releaseId + '?inc=artist-credits+labels+discids+recordings&fmt=json',
        headers: {
          'User-Agent': 'MoonSongs/' + version + ' ( alberto.luna.95@gmail.com )'
        },
        json: true
      };
      debugLogger.debug('[Requesting track number and album year] | ' +
      '[Url: ' + requestTrackYear.url +']');
      request(requestTrackYear, function(err, response, body) {
        if(err) {
          errorLogger.error('[Error getting song year and track number from musicbrainz] | ' +
          '[Url: ' + requestTag.url + '] |' +
          '[Error: ' + err + ']');
          return deferred.reject('Error getting song year and track number from musicbrainz');
        }
        if (!err && response.statusCode === 200) {
          tags.year = new Date(body.date).getFullYear();
          tags.track = -1;
          var tracks = body.media[0].tracks;
          for (var j in tracks) {
            if (tags.title === tracks[j].title) {
              tags.track = tracks[j].number;
              break;
            }
          }
          if (tags.track === -1) {
            debugLogger.debug('Error getting track number');
            tags.track = 0;
          }

          debugLogger.debug('[Successfully got song year and track number] | ' +
          '[File: ' + tags.path + ']' +
          '[Year: ' + tags.year + '] | ' +
          '[Track: ' + tags.track + ']');
          deferred.resolve(tags);
        } else {
          tags.track = 0;
          debugLogger.warn('[Http error getting song year and track number] | ' +
          '[Http status code: ' + response.statusCode + ']');
          deferred.resolve(tags);
        }
      });
    } else {
      debugLogger.warn('[Http error getting song tags] | ' +
      '[Http status code: ' + response.statusCode + ']');
      deferred.resolve(unknownTags);
    }
  });
  return deferred.promise;
}

/**
 * Get song tags, if tags aren't passed they were sought on internet
 * @param {Object} tags
 * @param {String} fileRoute
 * @param {Boolean} uploaded
 * @returns {Promise} with tags
 */
function getSongTags(tags, fileRoute, uploaded) {
  debugLogger.debug('[Getting song tags] | ' +
  '[File: ' + fileRoute + '] | ' +
  '[Funciton: getSongTags]');
  var deferred = q.defer();
  if (!tags.artist || !tags.album || !tags.title) {
    debugLogger.debug('[There is not passed all tags, asking Internet]');
    exports.getSongFingerPrint(fileRoute)
      .then(function(info) {
        return exports.getSongRid(info.duration, info.fingerPrint);
      })
      .then(function(rid) {
        if (uploaded) return findTags(rid, tags.fileName, tags.fileUploadName);
        else return findTags(rid, tags.fileName, tags.fileUploadName, fileRoute);
      })
      .then(function(requestedTags) {
        return deferred.resolve(requestedTags);
      })
      .catch(function(err) {
        errorLogger.error('[Error geting song tags from Internet] | ' +
        '[Error: ' + err + '] | ' +
        '[Function: getSongTags]');
        return deferred.reject(err);
      });
  } else {
    return q.fcall(function() {
      if (uploaded) tags.path = musicFolder + '/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
      else tags.path = fileRoute;
      debugLogger.debug('[Tags passed]');
      return tags;
    });
  }

  return deferred.promise;
}

function createArtistFolder(tags) {
  debugLogger.debug('[Creating artist folder] | ' +
  '[Artist: ' + tags.artist +'] | ' +
  '[Funciton: createArtistFolder]');
  var deferred = q.defer();
  var artistFolder = musicFolder + '/' + tags.artist;
  fs.mkdir(artistFolder, function(err) {
    if(err && err.code !== 'EEXIST') {
      debugLogger.warn('[Error creating artist folder] | ' +
      '[Folder: ' + artistFolder + ']' +
      '[Error: ' + err + ']');
      return deferred.reject(err);
    }
    debugLogger.debug('[Successfuly created artist folder] | ' +
    '[Folder: ' + artistFolder + ']');
    deferred.resolve();
  });
  return deferred.promise;
}

function createAlbumFolder(tags) {
  debugLogger.debug('[Creating album folder] | ' +
  '[Artist: ' + tags.artist +'] | ' +
  '[Album: ' + tags.album + '] | ' +
  '[Funciton: createAlbumFolder]');
  var deferred = q.defer();
  var albumFolder = musicFolder + '/' + tags.artist + '/' + tags.album;
  fs.mkdir(albumFolder, function(err) {
    if(err && err.code !== 'EEXIST') {
      debugLogger.warn('[Error creating album folder] | ' +
      '[Folder: ' + albumFolder + ']' +
      '[Error: ' + err + ']');
      return deferred.reject(err);
    }
    debugLogger.debug('[Successfuly created album folder] | ' +
    '[Folder: ' + albumFolder + ']');
    deferred.resolve();
  });
  return deferred.promise;
}

function moveSongToFolder(tags) {
  var deferred = q.defer();
  var sourcePath = 'uploads/' + tags.fileName;
  var destPath = musicFolder + '/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
  var source = fs.createReadStream(sourcePath);
  var dest = fs.createWriteStream(destPath);

  debugLogger.debug('[Moving song to folder] | ' +
  '[From: ' + sourcePath + '] | ' +
  '[To: ' + destPath + '] | ' +
  '[Function moveSongToFolder]');

  source.pipe(dest);
  source.on('end', function() {
    debugLogger.debug('[Succesfuly move song to folder] | ' +
    '[Folder: ' + destPath + ']');
    deferred.resolve();
  });
  source.on('error', function(err) {
    errorLogger.error('[Error moving song to folder] | ' +
    '[From: ' + sourcePath + '] | ' +
    '[To: ' + destPath + '] | ' +
    '[Error: ' + err + ']');
    deferred.reject();
  });

  return deferred.promise;
}

function saveSong(tags) {
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
  newSong.artistUrl = '/api/songs/' + tags.artist + '/image';
  newSong.coverUrl ='/api/songs/' + tags.artist + '/' + tags.album + '/image';

  debugLogger.debug('[Saving song to database] | ' +
  '[Artist: ' + tags.artist +'] | ' +
  '[Album: ' + tags.album + '] | ' +
  '[Title: ' + tags.title + '] | ' +
  '[Function: saveSong]');

  newSong.save(function(err) {
    if(err) {
      errorLogger.error('[Error saving song] | ' +
      '[Error: ' + err + ']');
      return deferred.reject();
    }
    deferred.resolve();
  });
  return deferred.promise;
}

function writeTags(tags, fileRoute) {
  var deferred = q.defer();
  var file = fileRoute || musicFolder + '/' + tags.artist + '/' + tags.album + '/' + tags.title + '.mp3';
  var writerId3 = new id3.Writer();
  var metaId3 = new id3.Meta({
    title: tags.title,
    album: tags.album,
    artist: tags.artist
  });

  debugLogger.debug('[Writting tags on song file] | ' +
  '[Artist: ' + tags.artist +'] | ' +
  '[Album: ' + tags.album + '] | ' +
  '[Title: ' + tags.title + '] | ' +
  '[File: ' + file + ']' +
  '[Function writeTags]');

  writerId3.setFile(new id3.File(file)).write(metaId3, function(err) {
    if(err) {
      errorLogger.error('[Error writing song tags] | ' +
      '[Error: ' + err + ']');
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
}

function downloadImages(tags) {
  var imageArtistPath = musicFolder + '/' + tags.artist + '/Artist.jpg';
  var imageCoverPath = musicFolder + '/' + tags.artist + '/' + tags.album + '/Cover.jpg';

  debugLogger.debug('[Downloading images if its needed] | ' +
  '[Function downloadImages]');

  fs.exists(imageCoverPath, function(exits) {
    if (!exits) {
      debugLogger.debug('[Need download cover image] | ' +
      '[Path: ' + imageCoverPath + ']');
      downloadImageCover(tags, imageCoverPath);
    }
  });
  fs.exists(imageArtistPath, function(exits) {
    if (!exits) {
      debugLogger.debug('[Need download artist image] | ' +
      '[Path: ' + imageArtistPath + ']');
      downloadImageArtist(tags, imageArtistPath);
    }
  });
}

function downloadImageCover(tags, path) {
  var urlGetAlbumInfo = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + lastfmApiKey + '&artist=' + tags.artist + '&album=' + tags.album + '&format=json';
  debugLogger.debug('[Requesting album info] | ' +
  '[Url: ' + urlGetAlbumInfo + '] | ' +
  '[Function: downloadImageCover]');
  request({
    url: urlGetAlbumInfo,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.album && body.album.image[4]['#text']) {
      var imageUrl = body.album.image[4]['#text'];
      debugLogger.debug('[Downloading cover image] | ' +
      '[Url: ' + imageUrl + ']');
      request(imageUrl).pipe(fs.createWriteStream(path));
    } else {
      debugLogger.debug('[Cover image not found coping default image]');
      var defaultCoverImage = 'assets/Album.jpg';
      copyFile(defaultCoverImage, path, function(err) {
        if(err) {
          errorLogger.error('[Error downloading image Artist] | ' +
          '[Error: ' + err + ']');
        }
      });
    }
  });
}

function downloadImageArtist(tags, path) {
  var urlGetArtistInfo = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=' + lastfmApiKey + '&artist=' + tags.artist + '&format=json';
  debugLogger.debug('[Requesting artist info] | ' +
  '[Url: ' + urlGetArtistInfo + '] | ' +
  '[Function: downloadImageCover]');
  request({
    url: urlGetArtistInfo,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.artist && body.artist.image[4]['#text']) {
      var imageUrl = body.artist.image[4]['#text'];
      debugLogger.debug('[Downloading artist image] | ' +
      '[Url: ' + imageUrl + ']');
      request(imageUrl).pipe(fs.createWriteStream(path));
    } else {
      debugLogger.debug('[Artist image not found coping default image]');
      var defaultArtistImage = 'assets/Artist.jpg';
      copyFile(defaultArtistImage, path, function(err) {
        if(err) {
          errorLogger.error('[Error downloading image Artist] | ' +
          '[Error: ' + err + ']');
        }
      });
    }
  });
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
