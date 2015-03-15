// app/utils/songUtils.js
console.log('loading songs utils...');

var shelljs = require('shelljs');
var q = require('q');
var fs = require('fs');
var request = require('request');
var ffmetadata = require("ffmetadata");
var Song = require('../models/song.js');

var acoustidApiKey = 'cSpUJKpD';
var lastfmApiKey = 'b6eea2a4758396a9c5369fa6938d0d7e';

exports.getSongFingerPrint = function(fileRoute) {
  var deferred = q.defer();
  shelljs.exec('fpcalc ' + '"' + fileRoute + '"', {silent:true, aync: true}, function(code, output) {
    var commandLines = output.split('\n');
    var duration = commandLines[1].split('=')[1];
    var fingerPrint = commandLines[2].split('=')[1];
    var info = {
      'duration' : duration,
      'fingerPrint' : fingerPrint
    };
    deferred.resolve(info);
  });
  return deferred.promise;
};

exports.getSongRid = function(duration, fingerPrint) {
  var deferred = q.defer();
  var requestRid = {
    url: 'http://api.acoustid.org/v2/lookup?client='+acoustidApiKey+'&meta=recordingids&duration='+duration+'&fingerprint='+fingerPrint,
    json: true
  };
  request(requestRid, function(error, response, body) {
    if(error) throw new Error(error);
    var rid = null;
    if(body.results.length !== 0) {
      rid = body.results[0].recordings[0].id;
    }
    console.log('rid: '+rid);
    deferred.resolve(rid);
  });
  return deferred.promise;
};

exports.findTags = function(rid, fileName, fileUploadName, filePath) {
  var deferred = q.defer();
  var unknownTags = {
    artist : 'Unknown',
    album : 'Unknown',
    title : fileUploadName,
    year: '1978',
    track: 0,
    genre: 'Unknown',
    'fileName' : fileName,
    autoTaged: true
  };
  unknownTags.path = filePath || 'music/'+unknownTags.artist+'/'+unknownTags.album+'/'+unknownTags.title+'.mp3';

  if(rid === null) {
    return q.fcall(function () {
      return unknownTags;
    });
  }

  var requestTag =  {
    url : 'http://musicbrainz.org/ws/2/recording/'+rid+'?inc=artist-credits+isrcs+releases&fmt=json',
    headers : {
      'User-Agent': 'MoonSongs/0.0.4 ( alberto.luna.95@gmail.com )'
    },
    json: true
  };
  console.log(requestTag.url);
  request(requestTag, function(error, response, body) {
    var tags = null;
    var releaseId = "";
    if (!error && response.statusCode === 200) {
      console.log('titulo: ' + body.title);
      console.log('album: ' + body.releases[0].title);
      console.log('artista: ' + body['artist-credit'][0].name);
      tags = {
        artist : body['artist-credit'][0].name,
        album : body.releases[0].title,
        title : body.title,
        genre : 'Unknown', // musicbrainz don't provide genre info
        'fileName' : fileName,
        autoTaged: true
      };
      tags.path = filePath || 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3';
      releaseId = body.releases[0].id;
      // obtain track number and year
      var requestTrackYear =  {
        url : 'http://musicbrainz.org/ws/2/release/'+releaseId+'?inc=artist-credits+labels+discids+recordings&fmt=json',
        headers : {
          'User-Agent': 'MoonSongs/0.0.2 ( alberto.luna.95@gmail.com )'
        },
        json: true
      };
      console.log(requestTrackYear.url);
      request(requestTrackYear, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          tags.year = new Date(body.date).getFullYear();
          tags.track = -1;
          var tracks = body.media[0].tracks;
          for(var j in tracks) {
            if(tags.title === tracks[j].title) {
              tags.track = tracks[j].number;
              console.log('numero de pista para ' + tags.title + ': ' + tags.track);
              console.log('anio: ' + tags.year);
              break;
            }
          }
          if(tags.track === -1) {
            tags.track = 0;
          }

          deferred.resolve(tags);
        } else {
          console.log('error al recibir track number');
          tags.track = 0;
          deferred.resolve(tags);
        }
      });
    } else {
      console.log('error al recibir tags');
      console.log(error);
      deferred.resolve(unknownTags);
    }
  });
  return deferred.promise;
};

exports.getSongTags = function(tags, fileRoute, uploaded) {
  var deferred = q.defer();
  if(!tags.artist || !tags.album || !tags.title) {
    exports.getSongFingerPrint(fileRoute)
    .then(function(info) {
      return exports.getSongRid(info.duration, info.fingerPrint);
    })
    .then(function(rid) {
      if(uploaded) return exports.findTags(rid, tags.fileName, tags.fileUploadName);
      else return exports.findTags(rid, tags.fileName, tags.fileUploadName, fileRoute);
    })
    .then(function(requestedTags) {
      return deferred.resolve(requestedTags);
    });
  } else {
    return q.fcall(function () {
      if(uploaded) tags.path = 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3';
      else tags.path = fileRoute;
      return tags;
    });
  }

  return deferred.promise;
};

function downloadImageCover(tags, path) {
  var urlGetAlbumInfo = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key='+lastfmApiKey+'&artist='+tags.artist+'&album='+tags.album+'&format=json';
  request({
    url: urlGetAlbumInfo,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200 && body.album && body.album.image[4]['#text']) {
      request(body.album.image[4]['#text']).pipe(fs.createWriteStream(path));
    } else {
      fs.createReadStream('assets/Album.jpg').pipe(fs.createWriteStream(path));
    }
  });
}

function downloadImageArtist(tags, path) {
  var urlGetArtistInfo = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key='+lastfmApiKey+'&artist='+tags.artist+'&format=json';
  request({
    url: urlGetArtistInfo,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200 && body.artist && body.artist.image[4]['#text']) {
      request(body.artist.image[4]['#text']).pipe(fs.createWriteStream(path));
    } else {
      fs.createReadStream('assets/Artist.jpg').pipe(fs.createWriteStream(path));
    }
  });
}

exports.downloadImages = function(tags) {
  var imageArtistPath = 'music/'+tags.artist+'/Artist.jpg';
  var imageCoverPath = 'music/'+tags.artist+'/'+tags.album+'/Cover.jpg';

  fs.exists(imageCoverPath, function(exits) {
    if(!exits) downloadImageCover(tags, imageCoverPath);
  });
  fs.exists(imageArtistPath, function(exits) {
    if(!exits) downloadImageArtist(tags, imageArtistPath);
  });
};

exports.writeTags = function(tags, fileRoute) {
  var deferred = q.defer();
  var file = fileRoute || 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3';
  ffmetadata.write(file, tags, function(err) {
    if (err) {
      console.log(err);
    }
    else console.log("tags writed");
    deferred.resolve();
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
  fs.rename('uploads/'+tags.fileName, 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3', deferred.makeNodeResolver());
  return deferred.promise;
};

exports.createAlbumFolder = function(tags) {
  var deferred = q.defer();
  fs.mkdir('music/'+tags.artist+'/'+tags.album, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
};

exports.createArtistFolder = function(tags) {
  var deferred = q.defer();
  fs.mkdir('music/'+tags.artist, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
};
