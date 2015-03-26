/*jshint expr:true */

var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  bcrypt = require('bcrypt-nodejs');

var user;

describe('User Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      email: 'user@localhost',
      userName: 'user',
      permissions: {
        canUpload: true,
        canListen: true,
        admin: true
      }
    });
    user.password = user.generateHash('pass');
    user.save(done);
  });

  afterEach(function(done) {
    User.remove().exec();
    done();
  });

  describe('Method Save', function() {
    it('should be able to save user without problems', function(done) {
      return user.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when you try to save user without a userName', function(done) {
      user.userName = '';

      return user.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when you try to save user without a password', function(done) {
      user.password = '';

      return user.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  describe('Password methods', function() {
    it('password compare should be true', function() {
      bcrypt.compareSync('pass', user.password).should.be.true;
    });

    it('password compare should be false', function() {
      bcrypt.compareSync('pas', user.password).should.be.false;
    });

    it('generateHash should be correct', function() {
      var hassPass = bcrypt.hashSync('pass', bcrypt.genSaltSync(8), null);
      bcrypt.compareSync('pass', hassPass).should.be.true;
    });

    it('generateHash should be incorrect', function() {
      var hassPass = bcrypt.hashSync('pss', bcrypt.genSaltSync(8), null);
      bcrypt.compareSync('pass', hassPass).should.be.false;
    });
  });
});
