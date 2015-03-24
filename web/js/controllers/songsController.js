angular.module('moonSongs.songsController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/songsView', {
    templateUrl: 'templates/songsView.html',
    controller: 'SongsController'
  });
}])

.controller('SongsController', function($http, $scope, Music, $location, $modal, Token, $log) {
  $http.get('api/songs')
    .success(function(data) {
      $scope.songs = data;
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
      $http.delete('api/songs/?artist=' + song.artist + '&album=' + song.album + '&title=' + song.title)
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

})


.controller('ModalDeleteSong', function($scope, $modalInstance) {

  $scope.ok = function() {
    $modalInstance.close($scope.selected);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
