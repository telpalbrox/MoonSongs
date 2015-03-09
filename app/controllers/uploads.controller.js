// app/controllers/uploads.controllers.js
console.log('loading uploads controller...');

var shelljs = require('shelljs');
var q = require('q');
var multer  = require('multer');
var fs = require('fs');
var request = require('request');
var Song = require('../models/song.js');

var acoustidApiKey = 'cSpUJKpD';
var lastfmApiKey = 'b6eea2a4758396a9c5369fa6938d0d7e';

function getSongFingerPrint(fileName) {
  var deferred = q.defer();
  shelljs.exec('fpcalc uploads/' + fileName, {silent:true, aync: true}, function(code, output) {
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
}

function getSongRid(duration, fingerPrint) {
  var deferred = q.defer();
  var requestRid = {
    url: 'http://api.acoustid.org/v2/lookup?client='+acoustidApiKey+'&meta=recordingids&duration='+duration+'&fingerprint='+fingerPrint,
    json: true
  };
  request(requestRid, function(error, response, body) {
    if(error) throw new Error(error);
    var rid = null;
    console.log(body);
    if(body.results.length !== 0) {
      rid = body.results[0].recordings[0].id;
    }
    console.log('rid: '+rid);
    deferred.resolve(rid);
  });
  return deferred.promise;
}

function findTags(rid, fileName, fileUploadName) {
  var deferred = q.defer();
  var unknownTags = {
    artist : 'Unknown',
    album : 'Unknown',
    title : fileUploadName,
    'fileName' : fileName
  };

  if(rid === null) {
    return q.fcall(function () {
      return unknownTags;
    });
  }

  var requestTag =  {
    url : 'http://musicbrainz.org/ws/2/recording/'+rid+'?inc=artist-credits+isrcs+releases&fmt=json',
    headers : {
      'User-Agent': 'MoonSongs/0.0.2 ( alberto.luna.95@gmail.com )'
    },
    json: true
  };
  console.log(requestTag.url);
  request(requestTag, function(error, response, body) {
    var tags = null;
    if (!error && response.statusCode === 200) {
      console.log('titulo: ' + body.title);
      console.log('album: ' + body.releases[0].title);
      console.log('artista: ' + body['artist-credit'][0].name);
      tags = {
        artist : body['artist-credit'][0].name,
        album : body.releases[0].title,
        title : body.title,
        'fileName' : fileName
      };
      deferred.resolve(tags);
    } else {
      console.log('error al recibir tags');
      console.log(error);
      deferred.resolve(unknownTags);
    }
  });
  return deferred.promise;
}

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

function downloadImages(tags) {
  var imageArtistPath = 'music/'+tags.artist+'/Artist.jpg';
  var imageCoverPath = 'music/'+tags.artist+'/'+tags.album+'/Cover.jpg';

  fs.exists(imageCoverPath, function(exits) {
    if(!exits) downloadImageCover(tags, imageCoverPath);
  });
  fs.exists(imageArtistPath, function(exits) {
    if(!exits) downloadImageArtist(tags, imageArtistPath);
  });
}

function saveSong(tags, res) {
  var newSong = new Song();
  newSong.artist = tags.artist;
  newSong.album = tags.album;
  newSong.title = tags.title;
  newSong.listens = 0;
  newSong.downloads = 0;
  newSong.found = true;
  newSong.save(function(err) {
    res.send(201);
  });
}

function moveSongToFolder(tags) {
  var deferred = q.defer();
  fs.rename('uploads/'+tags.fileName, 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3', deferred.makeNodeResolver());
  return deferred.promise;
}

function createAlbumFolder(tags) {
  var deferred = q.defer();
  fs.mkdir('music/'+tags.artist+'/'+tags.album, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
}

function createArtistFolder(tags) {
  var deferred = q.defer();
  fs.mkdir('music/'+tags.artist, function(error) {
    deferred.resolve();
  });
  return deferred.promise;
}

exports.upload = function(req, res) {
  if(!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }

  var tags = JSON.parse(req.body.info);
  tags.fileName = req.files.file.name;
  if(!tags.artist || !tags.album || !tags.title) {
    console.log('faltan tags');
    getSongFingerPrint(tags.fileName)
    .then(function(info) {
      return getSongRid(info.duration, info.fingerPrint);
    })
    .then(function(rid) {
      return findTags(rid, tags.fileName, tags.fileUploadName);
    })
    .then(function(requestedTags) {
      tags = requestedTags;
      return createArtistFolder(tags);
    })
    .then(function() {
      return createAlbumFolder(tags);
    })
    .then(function() {
      return moveSongToFolder(tags);
    })
    .then(function() {
      downloadImages(tags);
      saveSong(tags, res);
    })
    .fail(function(error) {
      console.log(error);
      res.status(501).send('Error al subir la cancion');
    });
  } else {
    createArtistFolder(tags)
    .then(function() {
      return createAlbumFolder(tags);
    })
    .then(function() {
      return moveSongToFolder(tags);
    })
    .then(function() {
      downloadImages(tags);
      saveSong(tags, res);
    })
    .fail(function(error) {
      console.log(error);
      res.status(501).send('Error al subir la cancion');
    });
  }
};
