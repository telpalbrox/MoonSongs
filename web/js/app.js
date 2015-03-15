// Declare app level module which depends on views, and components
angular.module('moonSongs', [
  'ngRoute',
  'pascalprecht.translate',
  'moonSongs.albumsController',
  'moonSongs.indexController',
  'moonSongs.loginController',
  'moonSongs.manageUsersController',
  'moonSongs.songsController',
  'moonSongs.startController',
  'moonSongs.uploadController',
  'moonSongs.view5Controller',
  'moonSongs.version',
  'moonSongs.version.version-directive',
  'starter.services',
  'angularFileUpload',
  'ui.bootstrap',
  'ngAnimate',
  'ngFx',
  'ngTouch',
  'angular-loading-bar'
]).
config(['$routeProvider', function($routeProvider, $rootScope, Token) {
  $routeProvider.otherwise({redirectTo: '/startView'});
}])
.config(function ($translateProvider) {
  var availableLangs = ['es', 'en'];
  $translateProvider.useStaticFilesLoader({
    prefix: 'lang/locale-',
    suffix: '.json'
  });
  var userLang = navigator.language || navigator.userLanguage;
  var locale = userLang[0]+userLang[1];
  locale = locale.toLowerCase();
  if(availableLangs.indexOf(locale) != 1) $translateProvider.use(locale);
  else $translateProvider.use('en');
  console.log('lenguaje: ' + locale);
});
