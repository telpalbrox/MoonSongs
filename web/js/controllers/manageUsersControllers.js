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

  ManageUsers.$inject = ['$scope', '$location', '$modal', '$log', 'Users'];

  function ManageUsers($scope, $location, $modal, $log, Users) {

    $scope.delete = function(size, user) {

      $scope.selected = user;

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        scope: $scope
      });

      modalInstance.result.then(function(user) {
        Users.remove(user._id)
          .then(function() {
            $scope.users.splice($scope.users.indexOf(user), 1);
            $log.info('deleted: ' + user.userName);
          })
          .catch(function(err) {
            $log.error(err);
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    Users.getAll()
      .then(function(res) {
        $scope.users = res.data;
      });

    $scope.createUser = function() {
      $location.path('/view5');
    };
  }

})();
