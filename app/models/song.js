// app/models/song.js
console.log('loading song model');

var mongoose = require('mongoose');

var songSchema = mongoose.Schema({
  title    : String,
  artist  : String,
  album   : String,
  downloads: Number,
  year    : String,
  track   : Number,
  genre: String,
  path: String,
  coverUrl: String,
  artistUrl: String,
  found : Boolean
});

module.exports = mongoose.model('Song', songSchema);
