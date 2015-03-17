/*jshint expr:true */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  app = require('../server'),
  Song = mongoose.model('Song'),
  User = mongoose.model('User'),
  agent = request.agent(app);

var user, sogn, credentials, token;

describe('Song CRUD tests', function() {
  before(function(done) {
    User.remove().exec();
    Song.remove().exec();
    done();
  });

  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      userName: 'test',
      password: 'demo'
    };
    user = new User({
      email: 'test@localhost',
      userName: credentials.userName,
      admin: true,
      permissions: {
        canUpload: true,
        canListen: true
      }
    });
    user.password = user.generateHash(credentials.password);
    user.save(function(err) {
      should.not.exist(err);
      agent.post('/public/authenticate')
        .send(credentials)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          token = res.body.token;
          // Create song
          song = new Song();
          song.artist = 'Artist';
          song.album = 'Album';
          song.title = 'Title';
          song.year = '2011';
          song.track = 5;
          song.genre = 'Alternative';
          song.path = 'music/Artist/Album/Title.mp3';
          song.listens = 0;
          song.found = true;
          song.save(function(err) {
            should.not.exist(err);
            done();
          });
        });
    });
  });

  afterEach(function(done) {
    User.remove().exec();
    Song.remove().exec();
    done();
  });

  describe('Get songs tests', function() {
    it('Should be able to get all songs', function(done) {
      song = new Song();
      song.artist = 'Artist2';
      song.album = 'Album2';
      song.title = 'Title2';
      song.year = '2011';
      song.track = 5;
      song.genre = 'Alternative';
      song.path = 'music/Artist2/Album2/Title2.mp3';
      song.listens = 0;
      song.found = true;
      song.save(function(err) {
        should.not.exist(err);
        agent.get('/private/songs')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            var songs = res.body;
            songs.should.be.an.array;
            songs.length.should.be.eql(2);
            songs[0].title.should.be.eql('Title');
            songs[1].title.should.be.eql('Title2');
            done();
          });
      });
    });

    it('should not be able to get songs when there are not songs', function(done) {
      Song.remove().exec();
      agent.get('/private/songs')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('should be able to get only a song', function(done) {
      agent.get('/private/songs/' + song.id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          var song = res.body;
          song.title.should.eql('Title');
          song.album.should.eql('Album');
          done();
        });
    });

    it('should not be able to get a song that not exists', function(done) {
      agent.get('/private/songs/5508268ef2edc50f36c526c0')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Delete song tests', function() {
    it('should be able to delete song', function(done) {
      agent.delete('/private/songs/?artist=Artist&album=Album&title=Title')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('should not be able to delete song that not exists', function(done) {
      agent.delete('/private/songs/?artist=Artis&album=Albu&title=Titl')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Check song tests', function() {
    it('should be able to ckeck if a song exits', function(done) {
      agent.get('/private/checkSong?artist=Artist&album=Album&title=Title')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('should be able to ckeck if a song not exits', function(done) {
      agent.get('/private/checkSong?artist=Artis&album=Albu&title=Titl')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Get albums tests', function() {
    it('should be able to get albums', function(done) {
      song = new Song();
      song.artist = 'Artist2';
      song.album = 'Album2';
      song.title = 'Title2';
      song.year = '2011';
      song.track = 5;
      song.genre = 'Alternative';
      song.path = 'music/Artist2/Album2/Title2.mp3';
      song.listens = 0;
      song.found = true;
      song.save(function(err) {
        should.not.exist(err);
        agent.get('/private/albums')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            var albums = res.body;
            albums.should.be.an.array;
            albums.length.should.be.eql(2);
            albums[0].should.have.property('songs');
            albums[0].songs.should.be.an.array;
            albums[0].songs.length.should.be.eql(1);
            albums[0].songs[0].title.should.eql('Title');
            albums[1].songs[0].title.should.eql('Title2');
            done();
          });
      });
    });

    it('should not be able to get albums when there are not songs', function(done) {
      Song.remove({}, function(err) {
        should.not.exist(err);
        agent.get('/private/albums')
          .set('Authorization', 'Bearer ' + token)
          .expect(404)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
    });
  });
});
