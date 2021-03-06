// app/models/user.js
console.log('loading user model...');
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define the schema for our user model
var userSchema = mongoose.Schema({
  email: String,
  userName: {
    type: String,
    default: '',
    required: 'userName cannot be blank'
  },
  password: {
    type: String,
    default: '',
    required: 'password cannot be blank'
  },
  permissions: {
    canUpload: Boolean,
    canListen: Boolean,
    admin: Boolean
  }
});

// methods =================================
//generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
