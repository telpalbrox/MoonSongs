(function() {
  angular.module('moonSongs.services', [
    'services.localSongs',
    'services.serverIp',
    'services.storage',
    'services.music',
    'services.authInterceptor',
    'services.token',
    'services.songs',
    'services.users'
  ]);

})();