angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ServerIp', function() {
    return {
      get: function() {
        return window.localStorage.getItem('serverIp') || "http://" + location.host;
      },
      set: function(ip) {
        window.localStorage.setItem('serverIp', ip);
      }
    };
  })
  .filter('toMinutes', function() {
    return function(input) {

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        if (s === '-1') return '00';
        return s;
      }

      if (isNaN(input)) {
        return "00:00";
      }

      input = Math.floor(input);
      var minutos = parseInt(input / 60);
      segundos = input % 60;
      return pad(minutos, 2) + ':' + pad(segundos, 2);
    };
  })
  .factory('LocalSongs', function() {
    return {
      get: function() {
        var songs = window.localStorage.getItem('localSongs');
        return JSON.parse(songs);
      },
      set: function(localsongs) {
        window.localStorage.setItem('localSongs', JSON.stringify(localsongs));
      }
    };
  })
  .factory('StorageService', function($rootScope) {

    return {

      get: function(key) {
        return localStorage.getItem(key);
      },

      save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
      },

      remove: function(key) {
        localStorage.removeItem(key);
      },

      clearAll: function() {
        localStorage.clear();
      }
    };
  })
  .service('Music', function(ServerIp) {
    function Music() {
      var self = this;
      self.audio = new Audio();
      self.songList = [];
      self.songIndex = 0;
      self.offline = false;
      self.changeSong = false;

      self.getSong = function() {
        return self.songList[self.songIndex];
      };

      self.getIndex = function() {
        if (self.songList.length === 0) {
          return 0;
        }

        return self.songIndex + 1;
      };

      self.addSong = function(song) {
        self.songList.push(song);
      };

      self.getAudioUrl = function() {
        if (self.offline) {
          return self.getSong().url;
        } else {
          return ServerIp.get() + '/private/' + self.getSong().path;
        }
      };

      self.play = function() {
        self.audio.play();
      };

      /**
       * Change src property and play song directly
       */
      self.playNow = function() {
        if (self.offline) {
          self.audio.release();
        }
        self.audio.src = self.getAudioUrl();
        self.play();
      };

      /*
       * Depending on pause property play song
       */
      self.playSong = function() {
        console.log('playSong');
        // self.audio.src = self.getAudioUrl();
        if (self.offline) {
          if (self.audio.mediaStatus == Media.MEDIA_RUNNING) {
            self.playNow();
          }
        } else {
          if (!self.audio.paused) {
            console.log('no estoy pausado');
            self.playNow();
          } else {
            console.log('estoy pausado: ' + self.audio.paused);
          }
        }
      };

      self.pause = function() {
        self.audio.pause();
      };

      /**
       * Now is a boolean parameter, if now the next song starts to listen
       * whatever was pause property
       */
      self.nextSong = function(now) {
        console.log('next');
        if (self.songIndex < self.songList.length - 1) {
          if (!now) {
            self.changeSong = true; // Controls finish media in offline mode
          }
          self.songIndex++;
          if (now) {
            console.log('now');
            self.playNow();
          } else {
            console.log('not now');
            self.playSong();
          }
        }
      };

      self.prevSong = function() {
        if (self.songIndex > 0) {
          self.changeSong = true;
          self.songIndex--;
          self.playSong();
        }
      };

      self.randomizeSongList = function() {
        var array = self.songList;
        var currentIndex = array.length,
          temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        self.songList = array;
      };

      self.getTime = function(fn) {
        if (self.offline) {
          self.audio.getCurrentPosition(function(position) {
            fn(position);
          });
        } else fn(self.audio.currentTime);
      };

      self.setTime = function(time) {
        if (self.offline) self.audio.seekTo(time * 1000);
        else self.audio.currentTime = time;
      };

      self.getDuration = function() {
        if (self.offline) {
          return self.audio.getDuration();
        } else return self.audio.duration;
      };

      self.mediaStatusChanged = function(status) {
        this.mediaStatus = status;
      };

      self.finishMedia = function() {
        if (!self.changeSong) {
          console.log('final cancion, cambiando...');
          self.nextSong(true);
          return;
        }
        self.changeSong = false;
      };

      self.reset = function() {
        self.pause();
        self.songList = [];
        self.songIndex = 0;
      };

      self.setOffline = function(offline) {
        self.offline = offline;
        self.reset();
        if (self.offline) {
          self.audio = new Media("", self.finishMedia, function() {}, self.mediaStatusChanged);
        } else {
          self.audio = new Audio();
          self.changeSong = false;
        }
      };

      self.equals = function(song) {
        var artist = self.getSong().artist;
        var album = self.getSong().album;
        var title = self.getSong().title;

        return artist === song.artist && album === song.album && title === song.title;
      };
    }

    return new Music();
  })
  .factory('Token', function(StorageService, $rootScope) {

    return {

      get: function() {
        return JSON.parse(StorageService.get('token'));
      },

      save: function(data) {
        $rootScope.status.logged = true;
        StorageService.save('token', data);
        $rootScope.currentUser = this.getUser();
      },

      remove: function() {
        StorageService.remove('token');
        $rootScope.status.logged = false;
        $rootScope.currentUser = null;
      },

      getUser: function() {
        if (StorageService.get('token')) {
          var encodedUser = StorageService.get('token').split('.')[1];
          return JSON.parse(window.atob(encodedUser));
        }
      }
    };
  })
  .factory('authInterceptor', function($rootScope, $q, StorageService,
    $location, Token) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if (StorageService.get('token')) {
          config.headers.Authorization = 'Bearer ' + JSON.parse(StorageService.get('token'));
        }
        return config;
      },
      response: function(response) {
        if (response.status == 401) {
          // Nunca pasa...
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        if (rejection.status == 401) {
          Token.remove();
          $location.path('/loginView');
        }
        return $q.reject(rejection);
      }
    };
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
