(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('manageUsersController', ManageUsers)
    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.
    .controller('ModalInstanceCtrl', function($scope, $modalInstance) {

      $scope.ok = function() {
        $modalInstance.close($scope.selected);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    });

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/manageUsersView', {
      templateUrl: 'templates/manageUsersView.html',
      controller: 'manageUsersController'
    });
  }

  ManageUsers.$inject = ['$http', '$scope', 'Music', '$location', '$modal', '$log'];

  function ManageUsers($http, $scope, Music, $location, $modal, $log) {

    $scope.delete = function(size, user) {

      $scope.selected = user;

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        scope: $scope
      });

      modalInstance.result.then(function(user) {
        $http.delete('api/users/' + user._id)
          .success(function() {
            $scope.users.splice($scope.users.indexOf(user), 1);
            console.log('borrado: ' + user.userName);
          })
          .error(function(err) {
            console.log('error al borrar: ' + err);
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $http.get('api/users')
      .success(function(data) {
        $scope.users = data;
      });

    $scope.createUser = function() {
      $location.path('/view5');
    };
  }

})();
