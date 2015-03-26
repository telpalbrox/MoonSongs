angular.module('moonSongs.indexController', ['ngRoute'])
  .controller('IndexController', function($rootScope, $scope, Music, $interval, StorageService, Token, $location, $translate) {

    $scope.time = 0;

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

    var whiteList = ['templates/startView.html', 'templates/loginView.html'];
    var blackListAdmin = ['templates/manageUsersView.html', 'templates/view5.html'];
    var blackListUpload = ['templates/uploadView.html'];
    var blackListListen = ['templates/songsView.html', 'templates/albumsView.html'];
    $scope.$on('$routeChangeSuccess', function(event, current, previous, rejection) {
      if (!$rootScope.status.logged && whiteList.indexOf(current.loadedTemplateUrl) == -1) {
        $location.path('/startView');
        return;
      }
      if ($rootScope.getUser()) {
        if (!$rootScope.getUser().permissions.admin && blackListAdmin.indexOf(current.loadedTemplateUrl) != -1) {
          $location.path('/startView');
          console.log('acceso denegado, solo admin');
          return;
        }
        if (!$rootScope.getUser().permissions.canUpload && blackListUpload.indexOf(current.loadedTemplateUrl) != -1) {
          $location.path('/startView');
          console.log('acceso denegado, solo upload');
          return;
        }
        if (!$rootScope.getUser().permissions.canListen && blackListListen.indexOf(current.loadedTemplateUrl) != -1) {
          $location.path('/startView');
          console.log('acceso denegado, solo listen');
          return;
        }
      }
    });

    $scope.logout = function() {
      Token.remove();
      $rootScope.status = {
        'logged': false
      };
      Music.reset();
      $location.path('/startView');
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

    var pulsado = false;

    $interval(function() {
      try {
        $scope.duration = Music.getDuration();
      } catch (e) {}
      Music.getTime(function(time) {
        if (!pulsado && time)
          $scope.time = time;
      });
    }, 1000);

    $('#rangeTime').mousedown(function(event) {
        console.log('pabajo');
        if (Music.getSong() === undefined)
          event.preventDefault();
        pulsado = true;
      })
      .mouseup(function(event) {
        console.log('parriba');
        pulsado = false;
      })
      .change(function(event) {
        if (Music.getSong() === undefined)
          event.preventDefault();
        var elem = $(this).get(0);
        console.log('cambio');
        $scope.time = elem.value;
        Music.setTime($scope.time);
      });

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
  });
