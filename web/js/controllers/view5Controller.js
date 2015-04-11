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

  View5.$inject = ['$http', '$scope', '$location', 'Users', '$log'];

  function View5($http, $scope, $location, Users, $log) {
    $scope.register = function() {
      Users.create($scope.email, $scope.userName, $scope.pass, $scope.admin, $scope.canListen, $scope.canUpload)
        .then(function(res) {
          $log.info(res);
          $location.path('/manageUsersView');
        })
        .catch(function(err) {
          $log.error(err);
        });
    };
  }
})();