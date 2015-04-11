(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('View5Ctrl', View5);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/view5', {
      templateUrl: 'templates/view5.html'
    });
  }

  View5.$inject = ['$location', 'Users', '$log'];

  function View5($location, Users, $log) {
    var vm = this;

    vm.register = register;

    function register() {
      Users.create(vm.email, vm.userName, vm.pass, vm.admin, vm.canListen, vm.canUpload)
        .then(function(res) {
          $log.info(res);
          $location.path('/manageUsersView');
        })
        .catch(function(err) {
          $log.error(err);
        });
    }
  }
})();