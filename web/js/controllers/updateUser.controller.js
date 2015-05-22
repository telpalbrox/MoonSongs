(function() {
  angular.module('moonSongs')
      .controller('UpdateUserController', UpdateUser);

  UpdateUser.$inject = ['$state', 'Users', '$log', '$stateParams', 'Token'];

  function UpdateUser($state, Users, $log, $stateParams, Token) {
    var vm = this;

    vm.update = update;
    vm.getUser = getUser;
    vm.user = {};
    vm.newPass = "";

    activate();

    function activate() {
      Users.get($stateParams.id)
          .then(function(res) {
            vm.user = res.data;
          })
          .catch(function(err) {
            $log.error(err);
          });
    }

    function update() {
      Users.update(vm.user, vm.newPass)
          .then(function() {
            if(Token.getUser().permissions.admin) {
              $state.go('manageUsers');
            } else {
              $state.go('start');
            }
          })
          .catch(function(err) {
            $log.error(err);
          });
    }

    function getUser() {
      return Token.getUser();
    }
  }
})();