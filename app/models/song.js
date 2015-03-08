// app/models/song.js
console.log('loading song model');

var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
  title    : String,
  artist  : String,
  album   : String,
  downloads: Number,
  listens : Number,
  found : Boolean
});

module.exports = mongoose.model('Song', songSchema);
