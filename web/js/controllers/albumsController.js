(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('AlbumsController', Albums);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/albums', {
      templateUrl: 'templates/albumsView.html'
    });
  }

  Albums.$inject = ['$http', '$scope', 'Music', '$modal', 'Songs', '$log'];

  function Albums($http, $scope, Music, $modal, Songs, $log) {
    var vm = this;

    vm.predicate = 'album';
    vm.reverse = false;

    vm.addSong = addSong;
    vm.play = play;
    vm.random = random;
    vm.remove = remove;

    activate();

    function activate() {
      getAlbums();
    }

    function addSong(song) {
      Music.addSong(song);
    }

    function play(song) {
      Music.addSong(song);
      Music.songIndex = Music.songList.length - 1;
      Music.playNow();
    }

    function random(album) {
      var arrSongs = [];

      for (var j in album.songs) {
        if(album.songs.hasOwnProperty(j)) {
          arrSongs.push(album.songs[j]);
        }
      }

      Music.songList = [];
      Music.songList = arrSongs;
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    }

    function remove(song, album) {
      vm.selected = song;

      var modalInstance = $modal.open({
        templateUrl: 'modals/modalDeleteSong.html',
        controller: 'ModalDeleteSong',
        scope: vm
      });

      modalInstance.result.then(function(song) {
        $http.delete('api/songs/' + song._id)
          .success(function() {
            var albumIndex = $scope.albums.indexOf(album);
            $scope.albums[albumIndex].songs.splice($scope.albums[albumIndex].songs.indexOf(song), 1);

            if ($scope.albums[albumIndex].songs.length === 0) $scope.albums.splice($scope.albums.indexOf(album), 1);
            console.log('borrado: ' + song.title);
          })
          .error(function(err) {
            console.log('error al borrar: ' + err);
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    function getAlbums() {
      Songs.getAlbums()
        .then(function(res) {
          vm.albums = res.data;
        })
        .catch(function(err) {
          $log.error('Error getting albums');
        });
    }
  }

})();
