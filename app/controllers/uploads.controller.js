// app/controllers/uploads.controllers.js
console.log('loading uploads controller');

require('shelljs/global');
var multer  = require('multer');
var fs = require('fs');
var request = require('request');
var Song = require('../models/song.js');

function findTags(tags, res, callback) {
  var fileName = tags.fileName;
  var pathSong = './uploads/' + fileName;
  var fileUploadName = tags.fileUploadName;
  var rid = exec('python ./bin/aidmatch.py '+pathSong, {silent:true}).output;
  var requestTag =  {
    url : 'http://musicbrainz.org/ws/2/recording/'+rid+'?inc=artist-credits+isrcs+releases&fmt=json',
    headers : {
      'User-Agent': 'MoonSongs/0.0.1 ( alberto.luna.95@gmail.com )'
    }
  }
  console.log(requestTag.url);
  request(requestTag, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      console.log('titulo: ' + body.title);
      console.log('album: ' + body.releases[0].title);
      console.log('artista: ' + body['artist-credit'][0].name);
      var tags = {
        artist : body['artist-credit'][0].name,
        album : body.releases[0].title,
        title : body.title,
        'fileName' : fileName
      }
      callback(tags, res);
    } else {
      console.log('error al recibir tags');
      console.log(error);
      var tags = {
        artist : 'Unknown',
        album : 'Unknown',
        title : fileUploadName,
        'fileName' : fileName
      }
      callback(tags, res);
    }
  });
}

function downloadImageCover(tags, path) {
  var urlGetAlbumInfo = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=b6eea2a4758396a9c5369fa6938d0d7e&artist='+tags.artist+'&album='+tags.album+'&format=json';
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
  var urlGetArtistInfo = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=b6eea2a4758396a9c5369fa6938d0d7e&artist='+tags.artist+'&format=json';
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

function moveSongToFolder(tags, res) {
  fs.rename('uploads/'+tags.fileName, 'music/'+tags.artist+'/'+tags.album+'/'+tags.title+'.mp3', function(error) {
    downloadImages(tags);
    saveSong(tags, res);
  });
}

function handleError(error, res) {
  if(error) {
    console.log(error);
    // res.send(501);
  }
}

function createAlbumFolder(tags, res) {
  fs.mkdir('music/'+tags.artist+'/'+tags.album, function(error) {
    moveSongToFolder(tags, res);
  });
}

function createArtistFolder(tags, res) {
  fs.mkdir('music/'+tags.artist, function(error) {
    createAlbumFolder(tags, res);
  });
}

exports.upload = function(req, res) {
  if(!req.user.permissions.canUpload) {
    res.send(401);
    return;
  }

  var tags = JSON.parse(req.body.info);
  tags.fileName = req.files.file.name;
  if(!tags.artist || !tags.album || !tags.title || tags.artist === "" || !tags.album === "" || !tags.title === "") {
    console.log('faltan tags');
    res.sendStatus(501);
    // findTags(tags, res, createArtistFolder);
  } else {
    createArtistFolder(tags, res);
  }
};
