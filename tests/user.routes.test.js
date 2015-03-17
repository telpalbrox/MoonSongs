/*jshint expr:true */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  app = require('../server'),
  Song = mongoose.model('Song'),
  User = mongoose.model('User'),
  agent = request.agent(app);

var user, credentials, token;

describe('User CRUD tests', function() {
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
          done();
        });
    });
  });

  afterEach(function(done) {
    User.remove().exec();
    done();
  });

  describe('Login tests', function() {
    it('should be able to login', function(done) {
      agent.post('/public/authenticate')
        .send(credentials)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should not be able to login, user name not exists', function(done) {
      credentials.userName = 'meh';
      agent.post('/public/authenticate')
        .send(credentials)
        .expect(401)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('should not be able to login, password is wrong', function(done) {
      credentials.password = 'dem';
      agent.post('/public/authenticate')
        .send(credentials)
        .expect(401)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

  describe('User creation tests', function() {
    it('should be able to create an user', function(done) {
      var data = {
        permissions: {}
      };

      // set the user's local credentials
      data.email = 'test2@localhost';
      data.password = 'demo';
      data.admin = true;
      data.userName = 'test2';
      data.permissions.canUpload = true;
      data.permissions.canListen = true;

      agent.post('/public/users')
        .send(data)
        .expect(201)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });

    });

    it('should not be able to create an user that has an used userName', function(done) {
      var data = {
        permissions: {}
      };

      // set the user's local credentials
      data.email = 'test2@localhost';
      data.password = 'demo';
      data.admin = true;
      data.userName = 'test';
      data.permissions.canUpload = true;
      data.permissions.canListen = true;

      agent.post('/public/users')
        .send(data)
        .expect(409)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });


  describe('Getting users tests', function() {
    it('should be able to get user list', function(done) {
      agent.get('/private/users')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          var body = res.body;
          body.should.be.an.array;
          body[0].userName.should.eql('test');
          done();
        });
    });

    it('should not be able to get users lists when there are not users', function(done) {
      User.remove().exec();
      agent.get('/private/users')
        .set('Authorization', 'Bearer ' + token)
        .expect(401)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });

    it('should not be able to get user list if you are not admin', function(done) {
      user.update({
        admin: false
      }, function() {
        agent.get('/private/users')
          .set('Authorization', 'Bearer ' + token)
          .expect(401)
          .end(function(err, res) {
            should.not.exist(err);
            done();
          });
      });
    });

    it('should be able to get a user', function(done) {
      agent.get('/private/users/' + user._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          var body = res.body;
          body.userName.should.eql('test');
          done();
        });
    });
  });

  describe('Update user tests', function() {
    it('should be able to update a user', function(done) {
      var data = {
        permissions: {}
      };

      // set the user's local credentials
      data.email = 'test@localhost';
      data.password = 'demo';
      data.admin = true;
      data.userName = 'test';
      data.permissions.canUpload = false;
      data.permissions.canListen = true;

      agent.put('/private/users/' + user._id)
        .set('Authorization', 'Bearer ' + token)
        .send({
          user: data
        })
        .expect(201)
        .end(function(err, res) {
          should.not.exist(err);
          User.findById(user.id, function(err, user) {
            should.not.exist(err);
            user.permissions.canUpload.should.be.false;
            done();
          });
        });
    });

    it('should be able to update only a field of that user', function(done) {
      data = {
        email: 'test@email.com'
      };

      agent.put('/private/users/' + user._id)
        .set('Authorization', 'Bearer ' + token)
        .send({
          user: data
        })
        .expect(201)
        .end(function(err, res) {
          should.not.exist(err);
          User.findById(user.id, function(err, user) {
            should.not.exist(err);
            user.email.should.eql('test@email.com');
            should(user.userName).not.be.undefined;
            should(user.permissions.canUpload).be.true;
            done();
          });
        });
    });

    it('should not be able to update a user that not exists', function(done) {
      var data = {
        permissions: {}
      };

      // set the user's local credentials
      data.email = 'test@localhost';
      data.password = 'demo';
      data.admin = true;
      data.userName = 'test';
      data.permissions.canUpload = false;
      data.permissions.canListen = true;

      agent.put('/private/users/5508268ef2edc50f36c526c0')
        .set('Authorization', 'Bearer ' + token)
        .send({
          user: data
        })
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });

  describe('Delete users tests', function() {
    it('should be able to delete a user', function(done) {
      agent.delete('/private/users/' + user._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          User.findById(user.id, function(err, user) {
            should.not.exist(err);
            should(user).be.null;
            done();
          });
        });
    });

    it('should not be able to delete a user that not exists', function(done) {
      agent.delete('/private/users/5508268ef2edc50f36c526c0')
        .set('Authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);
          done();
        });
    });
  });
});
