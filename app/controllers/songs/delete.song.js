var log4js = require('log4js');
var mongoose = require('mongoose');
var Boom = require('boom');
var rimraf = require('rimraf');
var songLib = require('../../libs/song.lib');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var Song = mongoose.model('Song');
var packageJson = require('../../../package.json');
var path = require('path');
var musicFolder = path.resolve(packageJson.config.musicFolder);
var async = require('async');

module.exports = function(req, res) {
    mainLogger.trace('[File: delete.song.js] | ' +
        '[Route DELETE /api/songs/' + req.params.id + '] | ' +
        '[Function delete] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    var findParams = songLib.getFindParams(req);
    if(!findParams) return res.status(400).send();

    async.waterfall([
        function(callback) {
            // check if song exists
            Song.findOne(findParams, function(err, song) {
                if(err) {
                    return callback({
                        response: Boom.badImplementation('Server error finding song'),
                        error: err
                    });
                }
                if(!song) {
                    return callback({
                        response: Boom.notFound('Song not found')
                    });
                }
                callback(null, song);
            });
        },
        function(song, callback) {
            // remove song from database
            song.remove(function(err) {
                if(err) {
                    return callback({
                        response: Boom.badImplementation('Error deleting song'),
                        error: err
                    });
                }
                callback(null, song);
            });
        }, function(song, callback) {
            // If there is not any song with that artist remove artist folder
            Song.find({ artist: song.artist }, function(err, songs) {
                if(err) {
                    return callback({
                        response: Boom.badImplementation('Server error finding songs by artist'),
                        error: err
                    });
                }
                if(!songs.length) {
                    rimraf(musicFolder + '/' + song.artist, function(err) {
                        if(err) {
                            return callback({
                                response: Boom.badImplementation('Server deleting artist song folder'),
                                error: err
                            });
                        }
                        callback(null, null);
                    });
                } else {
                    callback(null, song);
                }
            });
        }, function(song, callback) {
            // If there is not any song with that album remove album folder
            if(!song) {
                return callback(null, null);
            }

            Song.find({ album: song.album}, function(err, songs) {
                if(err) {
                    return callback({
                        response: Boom.badImplementation('Server error finding songs by album'),
                        error: err
                    });
                }

                if(!songs.length) {
                    rimraf(musicFolder + '/' + song.artist + '/' + song.album, function(err) {
                        if(err) {
                            return callback({
                                response: Boom.badImplementation('Server deleting album song folder'),
                                error: err
                            });
                        }
                        callback(null, null);
                    });
                } else {
                    callback(null, song);
                }
            });
        }, function(song, callback) {
            if(!song) {
                return callback();
            }

            fs.unlink(song.path, function(err) {
                if(err) {
                    return callback({
                        response: Boom.badImplementation('Server deleting album song folder'),
                        error: err
                    });
                }
                callback();
            });
        }
    ], function(err) {
        if(err) {
            errorLogger.error('Error deletting song');
            errorLogger.log(err.error);
            return res.status(err.response.message).send(err.response);
        }
        res.sendStatus(204);
    });
};
