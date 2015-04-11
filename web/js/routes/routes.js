/**
 * Created by alberto on 11/04/15.
 */
(function() {
  angular.module('moonSongs')
    .config(configRoutes)
    .run(clientAuth);

  configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function configRoutes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/start");
    $stateProvider
      .state('start', {
        url: '/start',
        templateUrl: 'templates/startView.html'
      })
      .state('songs', {
        url: '/songs',
        templateUrl: 'templates/songsView.html'
      })
      .state('albums', {
        url: '/albums',
        templateUrl: 'templates/albumsView.html'
      })
      .state('upload', {
        url: '/upload',
        templateUrl: 'templates/uploadView.html'
      })
      .state('manageUsers', {
        url: '/manageUsers',
        templateUrl: 'templates/manageUsersView.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/loginView.html'
      })
      .state('view5', {
        url: '/view5',
        templateUrl: 'templates/view5.html'
      });
  }

  clientAuth.$inject = ['$rootScope', 'Token', '$log', '$location'];

  function clientAuth($rootScope, Token, $log, $location) {
    $rootScope.$on('$stateChangeStart', checkAuth);

    function checkAuth(event, toState) {
      var user = Token.getUser();
      var whiteList = ['start', 'login'];
      if(!user) {
        if(whiteList.indexOf(toState.name) === -1) {
          console.log('no esta en la lista blanca');
          $log.error('Unauthorized');
          $location.path('/start');
          return event.preventDefault();
        }
        return;
      }
      // console.log(user.userName + ' va de ' + fromState.name + ' a ' + toState.name);
      var auth = {
        'canListen': ['songs', 'albums'],
        'canUpload': ['upload'],
        'admin': ['manageUsers', 'view5']
      };

      for(var permission in auth) {
        if(auth.hasOwnProperty(permission)) {
          if(user.permissions[permission]) {
            if(auth[permission].indexOf(toState.name) !== -1 || whiteList.indexOf(toState.name) !== -1) {
              // $log.info('Aauthorized');
              return;
            }
          }
        }
      }
      // $log.error('Unauthorized');
      $location.path('/start');
      return event.preventDefault();
    }
  }
})();