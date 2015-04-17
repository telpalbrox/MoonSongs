/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular
    .module('services.localSongs')
    .factory('LocalSongs', LocalSongs);

  function LocalSongs() {
    var service = {
      get: get,
      set: set
    };

    return service;

    ////////////////

    function get() {
      var songs = window.localStorage.getItem('localSongs');
      return JSON.parse(songs);
    }

    function set(localsongs) {
      window.localStorage.setItem('localSongs', JSON.stringify(localsongs));
    }


  }
})();