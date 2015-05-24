var log4js = require('log4js');
var mongoose = require('mongoose');
var songLib = require('../../libs/song.lib');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');

module.exports = function(req, res) {
    mainLogger.trace('[File: listen.song.js] | ' +
        '[Route GET /api/songs/' + req.params.artist + '/' + req.params.album + '/' + req.params.title + '/listen] | ' +
        '[Function listen] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var findParams = songLib.getFindParams(req);
    if(!findParams) return res.status(400).send();

    Song.findOne(findParams, function(err, song) {
        if(err) {
            errorLogger.error('Error getting song');
            errorLogger.error(err);
            return res.status(500).send('Error al buscar la cancion');
        }
        if(!song) return res.status(404).send('nosta');
        mainLogger.info('[File: ' + song.path + ']');
        res.sendFile(song.path, function(err) {
            if(err) {
                errorLogger.error('Error sending song');
                errorLogger.error(err);
            }
        });
    });
};
