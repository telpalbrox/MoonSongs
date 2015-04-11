(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('ModalDeleteSong', ModalDeleteSong)
    .controller('SongsController', SongsCtr);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/songsView', {
      templateUrl: 'templates/songsView.html'
    });
  }

  SongsCtr.$inject = ['$http', '$scope', 'Music', '$modal', '$log', 'Songs'];

  function SongsCtr($http, $scope, Music, $modal, $log, Songs) {
    var vm = this;

    vm.predicate = 'album';
    vm.reverse = false;

    vm.addSong = addSong;
    vm.play = play;
    vm.random = random;
    vm.remove = remove;

    activate();

    function activate() {
      getSongs();
    }

    function addSong(song) {
      Music.addSong(song);
    }

    function play(song) {
      Music.addSong(song);
      Music.songIndex = Music.songList.length - 1;
      Music.playNow();
    }

    function random() {
      Music.songList = [];
      Music.songList = JSON.parse(JSON.stringify(vm.songs));
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    }

    function remove(song) {
      vm.selected = song;

      var modalInstance = $modal.open({
        templateUrl: 'modals/modalDeleteSong.html',
        controller: 'ModalDeleteSong',
        scope: vm
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
    }

    function getSongs() {
      Songs.getAll()
        .then(function(res) {
          vm.songs = res.data;
        })
        .catch(function(err) {
          $log.error('Error getting songs');
        });
    }
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