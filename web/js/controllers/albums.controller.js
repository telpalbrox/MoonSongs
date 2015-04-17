(function() {
  angular.module('moonSongs')
    .controller('AlbumsController', Albums);

  Albums.$inject = ['Music', '$modal', 'Songs', '$log'];

  function Albums(Music, $modal, Songs, $log) {
    var vm = this;

    vm.predicate = 'album';
    vm.reverse = false;

    vm.addSong = addSong;
    vm.play = play;
    vm.random = random;
    vm.remove = remove;

    activate();

    function activate() {
      getAlbums();
    }

    function addSong(song) {
      Music.addSong(song);
    }

    function play(song) {
      Music.addSong(song);
      Music.songIndex = Music.songList.length - 1;
      Music.playNow();
    }

    function random(album) {
      var arrSongs = [];

      for (var j in album.songs) {
        if(album.songs.hasOwnProperty(j)) {
          arrSongs.push(album.songs[j]);
        }
      }

      Music.songList = [];
      Music.songList = arrSongs;
      Music.randomizeSongList();
      Music.songIndex = 0;
      Music.playNow();
    }

    function remove(song, album) {
      vm.selected = song;

      var modalInstance = $modal.open({
        templateUrl: 'modals/modalDeleteSong.html',
        controller: 'ModalInstanceCtrl'
      });

      modalInstance.result.then(function(song) {
        Songs.remove(vm.selected._id)
          .then(function() {
            var albumIndex = vm.albums.indexOf(album);
            vm.albums[albumIndex].songs.splice(vm.albums[albumIndex].songs.indexOf(vm.selected), 1);
            if (vm.albums[albumIndex].songs.length === 0) vm.albums.splice(vm.albums.indexOf(album), 1);
            $log.info('song deleted');
          })
          .catch(function() {
            $log.info('error deleting song');
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
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
