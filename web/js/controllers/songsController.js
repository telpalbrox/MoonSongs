(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('ModalDeleteSong', ModalDeleteSong)
    .controller('SongsController', SongsCtr);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/songsView', {
      templateUrl: 'templates/songsView.html',
      controller: 'SongsController'
    });
  }

  SongsCtr.$inject = ['$http', '$scope', 'Music', '$modal', '$log', 'Songs'];

  function SongsCtr($http, $scope, Music, $modal, $log, Songs) {
    Songs.getAll()
      .then(function(res) {
        $scope.songs = res.data;
      })
      .catch(function() {

      });

    $scope.predicate = 'album';
    $scope.reverse = false;

    $scope.addSong = function(song) {
      Music.addSong(song);
    };

    $scope.play = function(song) {
      Music.addSong(song);
      Music.songIndex = Music.songList.length - 1;
      Music.playNow();
    };

    $scope.random = function() {
      Music.songList = [];
      Music.songList = JSON.parse(JSON.stringify($scope.songs));
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    };

    $scope.delete = function(song) {

      $scope.selected = song;

      var modalInstance = $modal.open({
        templateUrl: 'modals/modalDeleteSong.html',
        controller: 'ModalDeleteSong',
        scope: $scope
      });

      modalInstance.result.then(function(song) {
        $http.delete('api/songs/' + song._id)
          .success(function() {
            $scope.songs.splice($scope.songs.indexOf(song), 1);
            console.log('borrado: ' + song.title);
          })
          .error(function(err) {
            console.log('error al borrar: ' + err);
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }

  //TODO Repair delete modal
  ModalDeleteSong.$inject = ['$scope', '$modalInstance'];

  function ModalDeleteSong($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close($scope.selected);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();