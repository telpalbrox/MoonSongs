(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('LoginController', Login);

  Login.$inject = ['Token', '$location', 'Users', '$log'];

  function Login(Token, $location, Users, $log) {
    var vm = this;

    vm.login = login;

    function login() {
      Users.login(vm.userName, vm.pass)
        .then(function(res) {
          Token.save(res.data.token);
          $location.path('/startView');
        })
        .catch(function(err) {
          $log.error('Error when login: ' + err.data);
        });
    }
  }

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/loginView', {
      templateUrl: 'templates/loginView.html'
    });
  }
})();
