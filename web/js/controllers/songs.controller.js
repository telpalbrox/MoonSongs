(function() {
  angular.module('moonSongs')
    .controller('SongsController', SongsCtr);

  SongsCtr.$inject = ['Music', '$modal', '$log', 'Songs', '$rootScope'];

  function SongsCtr(Music, $modal, $log, Songs, $rootScope) {
    var vm = this;

    vm.predicate = 'album';
    vm.reverse = false;
    vm.song = null;

    vm.addSong = addSong;
    vm.play = play;
    vm.random = random;
    vm.remove = remove;
    vm.update = update;

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

    function update(song) {
      vm.song = song;
      var modalInstance = $modal.open({
        templateUrl: 'modals/modalUpdateSong.html',
        controller: UpdateModalCtrl,
        controllerAs: 'mvm'
      });

      modalInstance.result.then(function(updatedTags) {
        for(var key in updatedTags) {
          if(updatedTags.hasOwnProperty(key)) {
            vm.song[key] = updatedTags[key];
          }
        }

        Songs.update(vm.song)
          .then(function() {
            $log.info('song updated');
          })
          .catch(function() {
            $log.info('error deleting song');
          });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
  }

  UpdateModalCtrl.$inject = ['$modalInstance'];

  function UpdateModalCtrl($modalInstance) {
    var mvm = this;
    mvm.ok = ok;
    mvm.cancel = cancel;

    function ok() {
      $modalInstance.close({
        title: mvm.title,
        album: mvm.album,
        artist: mvm.artist
      });
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

})();