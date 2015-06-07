(function() {
  angular.module('moonSongs')
    .controller('SongsController', SongsCtr);

  SongsCtr.$inject = ['Music', '$modal', '$log', 'Songs', '$rootScope'];

  function SongsCtr(Music, $modal, $log, Songs, $rootScope) {
    var vm = this;

    vm.song = null;

    activate();

    function activate() {
      getSongs();
    }

    function getSongs() {
      Songs.getAll()
        .then(function(res) {
          vm.songs = res.data;
        })
        .catch(function(err) {
          $log.error('Error getting songs');
        });
    }
  }

})();