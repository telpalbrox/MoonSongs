(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('LoginController', Login);

  Login.$inject = ['$http', '$rootScope', '$scope', 'Music', 'StorageService', 'Token', '$location'];

  function Login($http, $rootScope, $scope, Music, StorageService, Token, $location) {
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
  }

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/loginView', {
      templateUrl: 'templates/loginView.html',
      controller: 'LoginController'
    });
  }
})();
