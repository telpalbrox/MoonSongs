var log4js = require('log4js');
var mongoose = require('mongoose');
var songLib = require('../../libs/song.lib');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');

module.exports = function(req, res) {
    mainLogger.trace('[File: read.song.js] | ' +
        '[Route GET /api/songs/' + req.params.id + '] | ' +
        '[Function read] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var findParams = songLib.getFindParams(req);
    if(!findParams) return res.status(400).send();

    Song.findOne(findParams, function(err, song) {
        if (err) {
            errorLogger.error('Error getting song');
            errorLogger.error(err);
            res.status(500).send();
            return;
        }
        if (!song) {
            res.status(404).send();
            return;
        }
        res.json(song);
    });
};
