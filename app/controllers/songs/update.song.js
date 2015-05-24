var log4js = require('log4js');
var mongoose = require('mongoose');
var songLib = require('../../libs/song.lib');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');

module.exports = function(req, res) {
    mainLogger.trace('[File: update.song.js] | ' +
        '[Route PUT /api/songs/' + req.params.id + '] | ' +
        '[Function update] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    if(!req.params.id || !req.body.song) {
        res.sendStatus(400);
    }

    Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, song) {
        if(err) {
            errorLogger.error('Error getting song');
            errorLogger.error(err);
            return res.sendStatus(500);
        }

        if(!song) {
            return res.sendStatus(404);
        }

        songLib.writeTags(song, song.path)
            .then(function() {
                res.sendStatus(200);
            })
            .catch(function(err) {
                errorLogger.error('Error updating song tags of file: ' + song.path);
                errorLogger.error(err);
                res.sendStatus(500);
            });

    });


};
