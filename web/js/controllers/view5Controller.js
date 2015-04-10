(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('View5Ctrl', View5);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/view5', {
      templateUrl: 'templates/view5.html',
      controller: 'View5Ctrl'
    });
  }

  View5.$inject = ['$http', '$scope', 'Music', '$location'];

  function View5($http, $scope, Music, $location) {
    $scope.register = function() {
      console.log($scope.canUpload);
      $http.post('api/users', {
        'email': $scope.email,
        'password': $scope.pass,
        'admin': $scope.admin,
        'userName': $scope.userName,
        'canUpload': $scope.canUpload,
        'canListen': $scope.canListen
      })
        .success(function(data) {
          console.log('bien');
          console.log(data);
          $location.path('/manageUsersView');
        });
    };
  }
})();