var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var async = require('async');

module.exports = function(req, res) {
    mainLogger.trace('[File: users.controller.js] | ' +
        '[Route DELETE /api/users/' + req.params.id +'] | ' +
        '[Function delete] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');
    authLogger.info('[Attempting delete user: ' + req.params.id +'] | ' +
        '[Request from: ' + ( req.user ? req.user._id : 0) +']');

    User.findOneAndRemove({
        '_id': req.params.id
    }, function(err, user) {
        if (err) {
            authLogger.warn('[Delete failed, error finding userName, see error log]');
            errorLogger.error('Error deleting user');
            errorLogger.error(err);
            return res.status(500).send();
        }
        if (!user) {
            authLogger.warn('[Delete failed, user not found]');
            return res.status(404).send();
        }
        authLogger.info('[Delete successful, deleted user id: ' + req.params.id +']');
        res.status(200).send();
    });
};
