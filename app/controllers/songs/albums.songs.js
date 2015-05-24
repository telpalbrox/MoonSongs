var log4js = require('log4js');
var mongoose = require('mongoose');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');

module.exports = function(req, res) {
    mainLogger.trace('[File: albums.songs.js] | ' +
        '[Route GET /api/albums/] | ' +
        '[Function albums] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var albums = {};

    Song.find({}, function(err, songs) {
        if(err) {
            errorLogger.error('Error getting albums');
            errorLogger.log(err);
        }

        for (var j in songs) {
            if(songs.hasOwnProperty(j)) {
                if (albums[songs[j].album] === undefined) {
                    albums[songs[j].album] = {
                        'album': songs[j].album,
                        'artist': songs[j].artist,
                        'songs': []
                    };
                }
                albums[songs[j].album].songs.push(songs[j]);
            }
        }
        var arrAlbums = [];
        for (var key in albums) {
            if (albums.hasOwnProperty(key)) {
                arrAlbums.push(albums[key]);
            }
        }
        res.json(arrAlbums);
    });
};
