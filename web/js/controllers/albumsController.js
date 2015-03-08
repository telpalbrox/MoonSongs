angular.module('moonSongs.albumsController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/albums', {
    templateUrl: 'templates/albumsView.html',
    controller: 'AlbumsController'
  });
}])

.controller('AlbumsController', function($http, $scope, Music, $location) {
  $http.get('private/albums')
  .success(function(data) {
    $scope.albums = data;
  });
});
