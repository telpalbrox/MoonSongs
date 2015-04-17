(function() {
  angular.module('moonSongs')
    .controller('SongsController', SongsCtr);

  SongsCtr.$inject = ['Music', '$modal', '$log', 'Songs'];

  function SongsCtr(Music, $modal, $log, Songs) {
    var vm = this;

    vm.predicate = 'album';
    vm.reverse = false;

    vm.addSong = addSong;
    vm.play = play;
    vm.random = random;
    vm.remove = remove;

    activate();

    function activate() {
      getSongs();
    }

    function addSong(song) {
      Music.addSong(song);
    }

    function play(song) {
      Music.addSong(song);
      Music.songIndex = Music.songList.length - 1;
      Music.playNow();
    }

    function random() {
      Music.songList = [];
      Music.songList = JSON.parse(JSON.stringify(vm.songs));
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    }

    function remove(song) {
      vm.selected = song;

      var modalInstance = $modal.open({
        templateUrl: 'modals/modalDeleteSong.html',
        controller: 'ModalInstanceCtrl'
      });

      modalInstance.result.then(function(song) {
        Songs.remove(vm.selected._id)
          .then(function() {
            vm.songs.splice(vm.songs.indexOf(vm.selected), 1);
            $log.info('song deleted');
          })
          .catch(function() {
            $log.info('error deleting song');
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
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