/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular
    .module('services.storage')
    .factory('StorageService', StorageService);

  function StorageService() {
    var service = {
      get: get,

      save: save,

      remove: remove,

      clearAll: clearAll
    };

    return service;

    ////////////////

    function get(key) {
      return JSON.parse(localStorage.getItem(key));
    }

    function save(key, data){
      localStorage.setItem(key, JSON.stringify(data));
    }

    function remove(key) {
      localStorage.removeItem(key);
    }

    function clearAll() {
      localStorage.clear();
    }
  }

})();