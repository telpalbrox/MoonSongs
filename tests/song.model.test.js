require('../app/models/song');
var should = require('should'),
  mongoose = require('mongoose'),
  Song = mongoose.model('Song');

var song;

describe('Song Model Unit Tests:', function() {
  beforeEach(function(done) {
    song = new Song();
    song.artist = 'Sum 41';
    song.album = 'Screaming Bloody Murder';
    song.title = 'Jessica Kill';
    song.year = '2011';
    song.track = 5;
    song.genre = 'Alternative';
    song.path = 'music/Sum 41/Screaming Bloody Murder/Jessica Kill.mp3';
    song.listens = 0;
    song.found = true;
    song.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Song.remove().exec();
    done();
  });

  it('should be able to save song without problems', function(done) {
    return song.save(function(err) {
      should.not.exist(err);
      done();
    });
  });
});
