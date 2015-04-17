/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular.module('services.authInterceptor')
    .factory('authInterceptor', authInterceptor)
    .config(configHttp);

  authInterceptor.$inject = ['$q', '$location', 'Token'];

  function authInterceptor($q, $location, Token) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if (Token.get()) {
          config.headers.Authorization = 'Bearer ' + Token.get();
        }
        return config;
      },
      response: function(response) {
        if (response.status == 401) {
          // Nunca pasa...
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        if (rejection.status == 401) {
          Token.remove();
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }

  configHttp.$inject = ['$httpProvider'];

  function configHttp($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }
})();