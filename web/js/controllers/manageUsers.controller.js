(function() {
  angular.module('moonSongs')
    .controller('manageUsersController', ManageUsers);

  ManageUsers.$inject = ['$location', '$modal', '$log', 'Users', '$scope', '$state'];

  function ManageUsers($location, $modal, $log, Users, $scope, $state) {
    var vm = this;

    vm.remove = remove;
    vm.createUser = createUser;
    vm.updateUser = updateUser;

    activate();

    function activate() {
      getUsers();
    }

    function remove(user) {
      console.log('remove');
      $scope.selected = user;

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm',
        scope: $scope
      });

      modalInstance.result.then(function(user) {
        Users.remove(user._id)
          .then(function() {
            vm.users.splice(vm.users.indexOf(user), 1);
            $log.info('deleted: ' + user.userName);
          })
          .catch(function(err) {
            $log.error(err);
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    function getUsers() {
      Users.getAll()
        .then(function(res) {
          vm.users = res.data;
        })
        .catch(function(err) {
          $log.error('Error gettng users: ' + err.data);
        });
    }

    function createUser() {
      $location.path('/view5');
    }

    function updateUser(user) {
      $state.go('updateUser', {id: user._id});
    }
  }

})();
