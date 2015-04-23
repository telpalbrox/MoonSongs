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
        var deferred = $q.defer();
        deferred.reject('Need pass id or aritst/album/title');
        return deferred.promise;
      }
      if(arguments.length == 1) return $http.get(baseUrl() + '/songs/' + arguments[0]);
      else return $http.get(baseUrl() + '/songs/' + arguments[0] + '/' + arguments[1] + '/' + arguments[2] + '/info');
    }

    function getAlbums() {
      return $http.get(baseUrl() + '/albums');
    }

    function remove(id) {
      if(arguments.length != 1) {
        var deferred = $q.defer();
        deferred.reject('Must be 1 arguments: song id');
        return deferred.promise;
      }
      return $http.delete(baseUrl() + '/songs/' + id);
    }

    function update(newSong) {
      if(!newSong) {
        var deferred = $q.defer();
        deferred.reject('Need pass song');
        return deferred.promise;
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