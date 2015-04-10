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
        $rootScope.status.logged = true;
        StorageService.save('token', data);
        $rootScope.currentUser = this.getUser();
      },

      remove: function() {
        StorageService.remove('token');
        $rootScope.status.logged = false;
        $rootScope.currentUser = null;
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