angular.module('moonSongs.view5Controller', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'templates/view5.html',
    controller: 'View5Ctrl'
  });
}])

.controller('View5Ctrl', function($http, $scope, Music, $location) {
  $scope.register = function() {
    console.log($scope.canUpload);
    $http.post('public/users', {
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
});
