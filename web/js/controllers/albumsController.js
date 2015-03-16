angular.module('moonSongs.albumsController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/albums', {
    templateUrl: 'templates/albumsView.html',
    controller: 'AlbumsController'
  });
}])

.controller('AlbumsController', function($http, $scope, Music, $location, $modal) {
  $http.get('private/albums')
    .success(function(data) {
      $scope.albums = data;
      console.log(data);
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

  $scope.random = function(album) {
    var arrSongs = [];

    for (var j in album.songs) {
      arrSongs.push(album.songs[j]);
    }

    Music.songList = [];
    Music.songList = arrSongs;
    Music.randomizeSongList();
    Music.songIndex = 0;
    Music.playNow();
  };

  $scope.delete = function(song, album) {

    $scope.selected = song;

    var modalInstance = $modal.open({
      templateUrl: 'modals/modalDeleteSong.html',
      controller: 'ModalDeleteSong',
      scope: $scope
    });

    modalInstance.result.then(function(song) {
      $http.delete('private/songs/?artist=' + song.artist + '&album=' + song.album + '&title=' + song.title)
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
  };
});
