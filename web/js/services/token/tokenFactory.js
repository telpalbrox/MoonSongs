/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular.module('services.token')
    .factory('Token', Token);

  Token.$inject = ['StorageService', '$rootScope'];

  function Token(StorageService, $rootScope) {
    return {

      get: function() {
        return StorageService.get('token');
      },

      save: function(data) {
        StorageService.save('token', data);
        $rootScope.$broadcast('logged', true);
      },

      remove: function() {
        StorageService.remove('token');
        $rootScope.$broadcast('logged', false);
      },

      getUser: function() {
        if (StorageService.get('token')) {
          var encodedUser = StorageService.get('token').split('.')[1];
          return JSON.parse(window.atob(encodedUser));
        }
      }
    };
  }
})();