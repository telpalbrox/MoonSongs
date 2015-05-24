var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res) {
    mainLogger.trace('[File: list.users.js] | ' +
        '[Route GET /api/users] | ' +
        '[Function list] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    User.find({}, function(err, users) {
        if(err) {
            errorLogger.error('Error getting users');
            errorLogger.error(err);
            return;
        }
        if(users.length === 0) {
            res.status(404).send();
            return;
        }
        res.json(users);
    });
};
