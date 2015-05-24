var log4js = require('log4js');
var mongoose = require('mongoose');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');

module.exports = function(req, res) {
    mainLogger.trace('[File: list.songs.js] | ' +
        '[Route GET /api/songs] | ' +
        '[Function list] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    Song.find({}).sort({
        'album': 1,
        'title': 1
    }).exec(function(err, songs) {
        if(err) {
            errorLogger.error('Error getting songs');
            errorLogger.error(err);
            res.sendStatus(500);
            return;
        }
        res.json(songs);
    });
};
