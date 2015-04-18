/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular.module('services.music')
    .service('Music', MusicService);

  MusicService.$inject = ['ServerIp'];

  function MusicService(ServerIp) {
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
          var url = ServerIp.get() + '/api/songs/' + self.getSong().artist + '/' + self.getSong().album + '/' + self.getSong().title + '/listen';
          console.log(url);
          return url;
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
        if (self.offline) {
          self.audio = new Media("", self.finishMedia, function() {}, self.mediaStatusChanged);
        } else {
          self.audio = new Audio();
          self.changeSong = false;
        }
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
  }
})();