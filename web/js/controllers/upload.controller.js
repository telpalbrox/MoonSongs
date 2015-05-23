(function() {
  angular.module('moonSongs')
    .controller('UploadController', Upload);

  Upload.$inject = ['$scope', '$upload', 'Songs', '$log', '$q'];

  function Upload($scope, $upload, Songs, $log, $q) {

    var vm = this;
    vm.archivos = [];
    vm.uploads = [];
    vm.autotag = false;

    vm.addFiles = addFiles;
    vm.cancel = cancel;
    vm.remove = remove;
    vm.changeAutotag = changeAutotag;
    vm.addAndTag = addAndTag;
    vm.startUpload = startUpload;

    function addFiles($files) {
      $scope.autotag = false;
      for (var i in $files) {
        if($files.hasOwnProperty(i)) {
          addAndTag($files[i]);
        }
      }
    }

    function addAndTag(file) {
      id3(file, function(err, tags) {
        if (err) {
          console.log(err);
          return;
        }
        if (file.name.substring(file.name.length - 3, file.name.length) != 'mp3') {
          console.log(file.name + ' no es una cancion');
          return;
        }

        vm.archivos.push(file);
        var index = vm.archivos.length - 1;
        if (tags.artist) vm.archivos[index].artist = tags.artist.replace(/\0/g, '');
        if (tags.album) vm.archivos[index].album = tags.album.replace(/\0/g, '');
        if (tags.title) vm.archivos[index].title = tags.title.replace(/\0/g, '');
        if (tags.year) vm.archivos[index].year = tags.year.replace(/\0/g, '');
        if (tags.v1.track) vm.archivos[index].year = tags.v1.track;
        if (tags.v1.genre) vm.archivos[index].genre = tags.v1.genre.replace(/\0/g, '');
        vm.archivos[index].uploading = false;
        vm.archivos[index].fileUploadName = file.name;
        if (tags.v2.image) {
          //$scope.archivos[index]['imageData'] = encode(tags.v2.image.data);
          vm.archivos[index].image = 'data:image/jpeg;base64,' + encode(tags.v2.image.data);
        }
        //console.log(tags.title.replace(/\0/g, ''));
      });
    }

    function cancel() {
      try {
        for(var i = 0; i < vm.uploads.length; i++) {
          vm.uploads[i].abort();
        }
      } catch (err) {
        $log.error(err);
      }
      vm.uploads = [];
      vm.archivos = [];
    }

    function remove(archivo) {
      vm.archivos.splice(vm.archivos.indexOf(archivo), 1);
    }

    function upload(file) {
      file.uploading = true;
      var fileUpload = $upload.upload({
        url: 'api/upload',
        method: 'POST',
        fields: {
          'info': {
            artist: file.artist,
            album: file.album,
            title: file.title,
            year: file.year,
            track: file.track,
            genre: file.genre,
            // imageData: file.image,
            fileUploadName: file.fileUploadName
          }
        },
        file: file
      })
        .progress(function(evt) {
          file.percentage = parseInt(100.0 * evt.loaded / evt.total);
        })
        .success(function() {
        // file is uploaded successfully
        file.uploaded = true;
        file.uploading = false;
      }).error(function(err) {
        $log.error(err);
      });
      vm.uploads.push(fileUpload);
    }

    function startUpload(files) {
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < files.length; i++) {
        checkAndUpload(files[i]);
      }
    }

    function checkAndUpload(file) {
      checkSong(file)
        .then(function(file) {
          $log.info('Uploading song');
          upload(file);
        })
        .catch(function(file) {
          file.exists = true;
          $log.error('Song already uploaded');
        });
    }

    function checkSong(file) {
      var deferred = $q.defer();
      Songs.get(file.artist, file.album, file.title)
        .then(function() {
          deferred.reject(file);
        })
        .catch(function(err) {
          if(err.status == 404) {
            deferred.resolve(file);
          }
        });
      return deferred.promise;
    }

    function changeAutotag() {
      if (vm.autotag) {
        for (var i = 0; i < vm.archivos.length; i++) {
          vm.archivos[i].artist = "";
          vm.archivos[i].album = "";
          vm.archivos[i].title = "";
        }
      }
    }

    // public method for encoding an Uint8Array to base64
    function encode(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  }

})();
