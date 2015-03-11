angular.module('moonSongs.uploadController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uploadView', {
    templateUrl: 'templates/uploadView.html',
    controller: 'UploadController'
  });
}])

.controller('UploadController', function($http, $scope, Music, $upload) {
  // public method for encoding an Uint8Array to base64
  function encode( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  $scope.archivos = [];
  $scope.aniadirArchivos = function($files) {
    $scope.autotag = false;
    var aniadirYtags = function(file) {
      id3(file, function(err, tags) {
        if(!tags.album && !tags.title && !tags.artist && !tags.year) {
          return;
        }
        if(err) {
          console.log(err);
          return;
        }
        if(file.name.substring(file.name.length-3, file.name.length) != 'mp3') {
          console.log(file.name+' no es una cancion');
          return;
        }
        $scope.archivos.push(file);
        var index = $scope.archivos.length-1;
        if(tags.artist) $scope.archivos[index].artist = tags.artist.replace(/\0/g, '');
        if(tags.album) $scope.archivos[index].album = tags.album.replace(/\0/g, '');
        if(tags.title) $scope.archivos[index].title = tags.title.replace(/\0/g, '');
        if(tags.year) $scope.archivos[index].year = tags.year.replace(/\0/g, '');
        if(tags.v1.track) $scope.archivos[index].year = tags.v1.track;
        if(tags.v1.genre) $scope.archivos[index].genre = tags.v1.genre.replace(/\0/g, '');
        $scope.archivos[index].uploading = false;
        $scope.archivos[index].fileUploadName = file.name;
        if(tags.v2.image) {
          //$scope.archivos[index]['imageData'] = encode(tags.v2.image.data);
          $scope.archivos[index].image = 'data:image/jpeg;base64,' + encode(tags.v2.image.data);
        }
        //console.log(tags.title.replace(/\0/g, ''));
      });
    };
    for(var i in $files) {
      aniadirYtags($files[i]);
    }
  };

  $scope.cancelar = function() {
    try{
      $scope.upload.abort();
    } catch(e){}
    $scope.archivos = [];
  };

  $scope.eliminar = function(archivo) {
    $scope.archivos.splice($scope.archivos.indexOf(archivo), 1);
  };

  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    var checkSongAndUpload = function(file) {
      $http.get('private/checkSong?artist='+file.artist+'&album='+file.album+'&title='+file.title)
      .success(function(data) {
        file.exists = data;
        if(!file.exists) {
          file.uploading = true;
          $scope.upload = $upload.upload({
            url: 'private/upload', //private/upload.php script, node.js route, or servlet url
            method: 'POST', //or PUT
            //headers: {'header-key': 'header-value'},
            //withCredentials: true,
            fields: {'info' :{
              artist : file.artist,
              album : file.album,
              title : file.title,
              year : file.year,
              track : file.track,
              genre: file.genre,
              imageData : file.image,
              fileUploadName : file.fileUploadName
              }},
            file: file
          }).progress(function(evt) {
            var percent = parseInt(100.0 * evt.loaded / evt.total);
            file.percentage = percent;
          }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            file.uploaded = true;
            file.uploading = false;
          }).error(function(err) {
            console.log(err);
          });
        } else {
          console.log('la cancion esta ya subida');
        }
      });
    };
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      checkSongAndUpload(file);
    }
  };
  $scope.changeAutotag = function() {
    if($scope.autotag) {
      for(var x in $scope.archivos) {
        $scope.archivos[x].artist = "";
        $scope.archivos[x].album = "";
        $scope.archivos[x].title = "";
      }
    }
  };
});
