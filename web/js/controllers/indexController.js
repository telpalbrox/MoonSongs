(function() {
  angular.module('moonSongs')
    .controller('IndexController', Index);

  Index.$inject = ['$rootScope', 'Music', 'Token', '$location', '$translate', '$log'];

  function Index($rootScope, Music, Token, $location, $translate, $log) {

    var vm = this;

    vm.play = play;
    vm.pause = pause;
    vm.next = next;
    vm.prev = prev;
    vm.getSong = getSong;
    vm.getSongIndex = getSongIndex;
    vm.getMusicLength = getMusicLength;
    vm.changeLang = changeLang;
    vm.getUser = getUser;
    vm.logout = logout;

    activate();

    function activate() {
      setLoggedStatus();
      setMusicListeners();

      $rootScope.$on('logged', function(event, logged) {
        vm.status = {
          'logged': logged
        };
        vm.time = 0;
      });

    }

    function setLoggedStatus() {
      if (Token.get()) {
        vm.status = {
          'logged': true
        };
      } else {
        vm.status = {
          'logged': false
        };
      }
    }

    function setMusicListeners() {
      Music.audio.addEventListener('ended', function() {
        $rootScope.$broadcast('Music.audio.ended', self);
      });

      $rootScope.$on('Music.audio.ended', function() {
        Music.nextSong(true);
      });
    }

    function play() {
      if (Music.audio.src != encodeURI(Music.getAudioUrl())) {
        Music.audio.src = Music.getAudioUrl();
      }
      Music.play();
    }

    function pause() {
      Music.pause();
    }

    function next() {
      Music.nextSong();
    }

    function prev() {
      Music.prevSong();
    }

    function getSong() {
      return Music.getSong();
    }

    function getSongIndex() {
      return Music.getIndex();
    }

    function getMusicLength() {
      return Music.songList.length;
    }

    function changeLang(lang) {
      $translate.use(lang);
    }

    function getUser() {
      return Token.getUser();
    }

    function logout() {
      Token.remove();
      vm.status = {
        'logged': false
      };
      Music.reset();
      $location.path('/start');
    }
  }
})();