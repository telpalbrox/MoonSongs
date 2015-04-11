(function() {
  angular.module('moonSongs')
    .controller('IndexController', Index);

  Index.$inject = ['$rootScope', '$scope', 'Music', 'Token', '$location', '$translate'];

  // TODO refactor controller
  function Index($rootScope, $scope, Music, Token, $location, $translate) {

    if (!$rootScope.getUser) {
      $rootScope.getUser = Token.getUser;
    }
    if (Token.get()) {
      $rootScope.status = {
        'logged': true
      };
      $rootScope.currentUser = Token.getUser();
    } else {
      $rootScope.status = {
        'logged': false
      };
    }

    $scope.logout = function() {
      Token.remove();
      $rootScope.status = {
        'logged': false
      };
      Music.reset();
      $location.path('/start');
    };

    $scope.getSongIndex = function() {
      return Music.getIndex();
    };

    $scope.getSong = function() {
      return Music.getSong();
    };

    $scope.getMusicLength = function() {
      return Music.songList.length;
    };

    $scope.data = {
      'time': 0
    };

    $scope.play = function() {
      if (Music.audio.src != encodeURI(Music.getAudioUrl())) {
        Music.audio.src = Music.getAudioUrl();
      }
      Music.play();
    };

    $scope.pause = function() {
      Music.pause();
    };

    $scope.next = function() {
      Music.nextSong();
    };

    $scope.prev = function() {
      Music.prevSong();
    };

    $scope.changeLang = function(lang) {
      $translate.use(lang);
    };

    Music.audio.addEventListener('ended', function() {
      $rootScope.$broadcast('Music.audio.ended', self);
    });

    $rootScope.$on('Music.audio.ended', function() {
      Music.nextSong(true);
    });
  }
})();