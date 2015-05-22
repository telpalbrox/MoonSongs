/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular.module('services.songs')
    .factory('Songs', Songs);

  Songs.$inject = ['$q', '$http', 'ServerIp'];

  function Songs($q, $http, ServerIp) {
    return {
      getAll: getAll,
      get: get,
      getAlbums: getAlbums,
      remove: remove,
      update: update
    };

    function getAll() {
      return $http.get(baseUrl() + '/songs');
    }

    function get() {
      if(arguments.length != 1 && arguments.length != 3) {
        return $q.reject('Need pass id or aritst/album/title');
      }
      if(arguments.length == 1) return $http.get(baseUrl() + '/songs/' + arguments[0]);
      else return $http.get(baseUrl() + '/songs/' + arguments[0] + '/' + arguments[1] + '/' + arguments[2] + '/info');
    }

    function getAlbums() {
      return $http.get(baseUrl() + '/albums');
    }

    function remove(id) {
      if(arguments.length != 1) {
        return $q.reject('Must be 1 arguments: song id');
      }
      return $http.delete(baseUrl() + '/songs/' + id);
    }

    function update(newSong) {
      if(!newSong) {
        return $q.reject('Need pass song');
      }

      return $http.put(baseUrl() + '/songs/' + newSong._id, {
        song: newSong
      });

    }

    function baseUrl() {
      return ServerIp.get() + '/api';
    }
  }
})();