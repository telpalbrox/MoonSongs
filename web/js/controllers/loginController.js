angular.module('moonSongs.loginController', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/loginView', {
    templateUrl: 'templates/loginView.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', function($http, $rootScope, $scope, Music,
  StorageService, Token, $location) {
  $scope.login = function() {
    $http.post('api/authenticate', {
        'userName': $scope.userName,
        'password': $scope.pass
      })
      .success(function(data) {
        Token.save(data.token);
        $location.path('/startView');
      })
      .error(function(err) {
        console.log('error:');
        console.log(err);
      });
  };
});
