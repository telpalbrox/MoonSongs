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
      get: get,
      getAll: getAll,
      create: create,
      remove: remove,
      login: login,
      update: update
    };

    return service;

    ////////////////

    function getAll() {
      return $http.get(baseUrl() + '/users');
    }

    function create(email, userName, password, admin, canListen, canUpload) {
      if(arguments.length != 6) {
        return $q.reject('Must be 6 arguments: email, userName, password, admin, canListen and canUpload');
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

    function get(userId) {
      if(userId === undefined) {
        return $q.reject('It is needed an user id');
      }
      return $http.get(baseUrl() + '/users/' + userId);
    }

    function remove(id) {
      if(arguments.length != 1) {
        return $q.reject('Must be 1 arguments: user id');
      }
      return $http.delete(baseUrl() + '/users/' + id);
    }

    function login(userName, pass) {
      if(arguments.length != 2) {
        return $q.reject('Must be 2 arguments: userName, password');
      }
      return $http.post(baseUrl() + '/authenticate', {
        'userName': userName,
        'password': pass
      });
    }

    function update(updatedUser, newPass) {
      return $http.put(baseUrl() + '/users/' + updatedUser._id, {
        user: updatedUser,
        newPass: newPass
      });
    }

    function baseUrl() {
      return ServerIp.get() + '/api';
    }
  }
})();