var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res) {
    mainLogger.trace('[File: read.user.js] | ' +
        '[Route GET /api/users/' + req.params.id +'] | ' +
        '[Function read] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    if((req.user._id != req.params.id) && !req.user.permissions.admin) {
        authLogger.warn('No admins can\'t read other users');
        return res.sendStatus(401);
    }

    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if(err) {
            errorLogger.error('Error getting user');
            errorLogger.error(err);
            return;
        }
        if (!user) {
            res.status(404).send();
            return;
        }
        res.json(user);
    });
};
