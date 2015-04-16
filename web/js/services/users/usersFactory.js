/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular
    .module('services.users')
    .factory('Users', Users);

  Users.$inject = ['$q', '$http', 'ServerIp'];

  /* @ngInject */
  function Users($q, $http, ServerIp) {
    var service = {
      getAll: getAll,
      create: create,
      remove: remove,
      login: login
    };

    return service;

    ////////////////

    function getAll() {
      return $http.get(baseUrl() + '/users');
    }

    function create(email, userName, password, admin, canListen, canUpload) {
      if(arguments.length != 6) {
        var deferred = $q.defer();
        deferred.reject('Must be 6 arguments: email, userName, password, admin, canListen and canUpload');
        return deferred.promise;
      }
      return $http.post(baseUrl() + '/users', {
        'email': email,
        'password': password,
        'admin': admin,
        'userName': userName,
        'canUpload': canUpload,
        'canListen': canListen
      });
    }

    function remove(id) {
      if(arguments.length != 1) {
        var deferred = $q.defer();
        deferred.reject('Must be 1 arguments: user id');
        return deferred.promise;
      }
      return $http.delete(baseUrl() + '/users/' + id);
    }

    function baseUrl() {
      return ServerIp.get() + '/api';
    }

    function login(userName, pass) {
      if(arguments.length != 2) {
        var deferred = $q.defer();
        deferred.reject('Must be 2 arguments: userName, password');
        return deferred.promise;
      }
      return $http.post('api/authenticate', {
        'userName': userName,
        'password': pass
      });
    }
  }
})();