// config/updatedatabase.js
console.log('updating database');

var Song = require('../app/models/song.js');
var User = require('../app/models/user.js');
var path = require('path');
var async = require('async');
var musicDir = path.dirname(__dirname)+'/music';

module.exports = function(fs) {
  fs.readdir(musicDir, function(err, files) { // leo la carpeta music
    var fileSongs = [];

    for(i in files) {
      // si el archivo o carpeta empieza por punto esta oculto y no se tiene en cuenta
      if(files[i][0] == '.') {
        continue;
      }
      //console.log(files[i]);
      // si el archivo es un directorio leo su contenido, esta carpeta
      // representa al artista
      if(fs.statSync(musicDir+'/'+files[i]).isDirectory()) {
        var files2 = fs.readdirSync(musicDir+'/'+files[i]);
        var arrAlbums = [];
        for(j in files2) {
          // dentro de la carpeta del artista estan las carpetas de los albunes
          if(fs.statSync(musicDir+'/'+files[i]+'/'+files2[j]).isDirectory()) {
            // dentro de la carpeta de album
            var files3 = fs.readdirSync(musicDir+'/'+files[i]+'/'+files2[j]);
            for(k in files3) {
              // si el archivo termina en mp3 es una cancion
              if(files3[k].substring(files3[k].length-3, files3[k].length) == 'mp3') {

                // se obtiene el titulo de la cancion a traves del nombre del archivo
                var title = files3[k].substring(0, files3[k].length-4);
                // obtengo el artista y el album del array temporal
                var album = files2[j];
                var artist = files[i];
                fileSongs.push({
                  'artist' : artist,
                  'album' : album,
                  'title' : title});
                }
              }
            }
            //console.log('\t'+files2[j])
          }
        }
      }

      var updateDatabase = function(item, callback) {
        Song.findOne({
          'artist' : item.artist,
          'album' : item.album,
          'title' : item.title},
          function(err, song) {
            if(!song) {
              console.log('Encontrada cancion\nArtista: '+item.artist+'\n'
              +'Album: '+fileSongs[i].album+'\nTitulo: '+item.title+
              '\nNo estaba en la base de datos\n');
              var newSong = new Song();
              newSong.artist = item.artist;
              newSong.album = item.album;
              newSong.title = item.title;
              newSong.listens = 0;
              newSong.downloads = 0;
              newSong.found = true;
              newSong.save(function(err) {
                callback();
              });
            } else {
              console.log('Encontrada cancion\nArtista: '+item.artist+'\n'
              +'Album: '+item.album+'\nTitulo: '+item.title+
              '\nEstaba en la base de datos\n');
              Song.update({
              'artist' : item.artist,
              'album' : item.album,
              'title' : item.title} , { found : 'true' }, function (err, numberAffected, raw) {
                callback();
              });

            }

          });
      }

      async.series([function(callback) {
        Song.update({ found: true }, { found : 'false' }, { multi: true }, function (err, numberAffected, raw) {
          callback();
        });
      }]);

      async.eachSeries(fileSongs, updateDatabase, function() {
        Song.remove({ found : false }, function(err, songs) {

        });
        console.log('Terminada busqueda y actualizacion de canciones\n');
        User.find({}, function(err, users) {
          if(users.length != 0) {
            console.log('Hay creados '+users.length+' usuarios');
          } else {
            console.log('No hay usuarios creados, creando admin');
            newUser = new User();
            newUser.email = 'admin@localhost';
            newUser.userName = 'admin';
            newUser.password = newUser.generateHash('patata');
            newUser.admin = true;
            newUser.permissions.canUpload = true;
            newUser.permissions.canListen = true;
            newUser.save(function(err) {});
          }
        });
      });

    });
  }
