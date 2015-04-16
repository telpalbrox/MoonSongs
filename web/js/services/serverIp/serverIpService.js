/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular
    .module('services.serverIp')
    .factory('ServerIp', ServerIp);

  function ServerIp() {
    var factory = {
      get: get,
      set: set
    };

    return factory;

    ////////////

    function get() {
      return window.localStorage.getItem('serverIp') || location.protocol + '//' + location.host;
    }

    function set(ip) {
      window.localStorage.setItem('serverIp', ip);
    }
  }

})();