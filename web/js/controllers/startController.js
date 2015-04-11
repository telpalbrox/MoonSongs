(function() {
  angular.module('moonSongs')
    .config(configRoute)
    .controller('StartController', Start);

  configRoute.$inject = ['$routeProvider'];

  function configRoute($routeProvider) {
    $routeProvider.when('/startView', {
      templateUrl: 'templates/startView.html'
    });
  }

  function Start() {

  }
})();
