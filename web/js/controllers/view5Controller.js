(function() {
  angular.module('moonSongs')
    .controller('View5Ctrl', View5);

  View5.$inject = ['$location', 'Users', '$log'];

  function View5($location, Users, $log) {
    var vm = this;

    vm.register = register;

    function register() {
      Users.create(vm.email, vm.userName, vm.pass, vm.admin, vm.canListen, vm.canUpload)
        .then(function(res) {
          $log.info(res);
          $location.path('/manageUsers');
        })
        .catch(function(err) {
          $log.error(err);
        });
    }
  }
})();