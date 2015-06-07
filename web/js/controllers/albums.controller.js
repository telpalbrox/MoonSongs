(function() {
  angular.module('moonSongs')
    .controller('AlbumsController', Albums);

  Albums.$inject = ['Music', '$modal', 'Songs', '$log'];

  function Albums(Music, $modal, Songs, $log) {
    var vm = this;

    activate();

    function activate() {
      getAlbums();
    }

    function getAlbums() {
      Songs.getAlbums()
        .then(function(res) {
          vm.albums = res.data;
        })
        .catch(function(err) {
          $log.error('Error getting albums');
        });
    }
  }

})();
