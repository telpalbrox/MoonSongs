// Declare app level module which depends on views, and components
(function() {
  angular.module('moonSongs', [
    'ngRoute',
    'ui.router',
    'pascalprecht.translate',
    'moonSongs.version',
    'moonSongs.version.version-directive',
    'moonSongs.services',
    'moonSongs.filters',
    'moonSongs.directives',
    'angularFileUpload',
    'ui.bootstrap',
    'ngAnimate',
    'ngFx',
    'ngTouch',
    'angular-loading-bar'
  ])
    .config(configRouteProvider)
    .config(configTranstale);

  configRouteProvider.$inject = ['$routeProvider'];

  function configRouteProvider($routeProvider) {

  }

  configTranstale.$inject = ['$translateProvider'];

  function configTranstale($translateProvider) {
    var availableLangs = ['es', 'en'];
    $translateProvider.useStaticFilesLoader({
      prefix: 'lang/locale-',
      suffix: '.json'
    });
    var userLang = navigator.language || navigator.userLanguage;
    var locale = userLang[0] + userLang[1];
    locale = locale.toLowerCase();
    if (availableLangs.indexOf(locale) != 1) $translateProvider.use(locale);
    else $translateProvider.use('en');
    console.log('lenguaje: ' + locale);
  }
})();
