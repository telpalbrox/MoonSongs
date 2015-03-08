angular.module('moonSongs.startController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/startView', {
    templateUrl: 'templates/startView.html',
    controller: 'StartController'
  });
}])

.controller('StartController', function(Music, $scope) {

});
