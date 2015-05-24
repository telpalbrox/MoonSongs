var log4js = require('log4js');
var mongoose = require('mongoose');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');
var packageJson = require('../../../package.json');
var path = require('path');
var musicFolder = path.resolve(packageJson.config.musicFolder);
var im = require('imagemagick');
var fs = require('fs');

module.exports = function(req, res) {
    mainLogger.trace('[File: imageCover.song.js] | ' +
        '[Route GET /api/songs/' + req.params.artist + '/' + req.params.album + '/image] | ' +
        '[Function imageCover] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var album = req.params.album;
    var artist = req.params.artist;

    var height = 256 || req.query.height;
    var width = 256 || req.query.width;
    var file = musicFolder + '/' + artist + '/' + album + '/Cover.jpg';
    var fileCroped = musicFolder + '/' + artist + '/' + album + '/Cover.' + height + '.' + width + '.jpg';

    mainLogger.info('[Height: ' + height + '] | ' +
        '[Width: ' + width +'] | ' +
        '[File: ' + file + '] | ' +
        '[FileCroped: ' + fileCroped +']');

    fs.exists(file, function(exits) {
        if(!exits) {
            return res.sendStatus(404);
        }
        fs.exists(fileCroped, function(exists) {
            if(exists) {
                res.sendFile(fileCroped, function(err) {
                    if(err) console.log(err);
                });
            } else {
                var options = {
                    srcPath: file,
                    dstPath: fileCroped,
                    height: height,
                    width: width
                };
                mainLogger.info('[Need resizing: ' + file + ']');
                im.resize(options, function(err) {
                    if(err) {
                        errorLogger.error('[Error resizing file: ' + file + '] | ' +
                            '[Error: ' + err +']');
                        return res.sendStatus(500);
                    }
                    mainLogger.info('[Resizing finished: ' + fileCroped + ']');
                    res.sendFile(fileCroped, function(err) {
                        if(err) console.log(err);
                    });
                });
            }
        });
    });
};
