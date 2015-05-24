var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

module.exports = function(req, res) {
    mainLogger.trace('[File: users.controller.js] | ' +
        '[Route PUT /api/users/' + req.params.id +'] | ' +
        '[Function update] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    if((req.user._id != req.params.id) && !req.user.permissions.admin) {
        authLogger.warn('No admins can\'t update other users');
        return res.sendStatus(401);
    }

    if (!req.body.user) {
        res.status(400).send();
        return;
    }

    var updatedUser = req.body.user;

    if(!updatedUser._id) {
        updatedUser._id = req.params.id;
    }

    if(req.body.newPass) {
        updatedUser.password = bcrypt.hashSync(req.body.newPass, bcrypt.genSaltSync(8), null);
    }

    async.waterfall([function(callback) {
        User.findOne({_id: updatedUser._id}, function(err, user) {
            if(err) {
                errorLogger.error('Error getting user');
                errorLogger.error(err);
                return callback({
                    statusCode: 500,
                    message: 'Error getting user'
                });
            }
            if(!user) {
                return callback({
                    statusCode: 404,
                    message: 'User not found'
                });
            }
            if(!areEqualPermissions(updatedUser.permissions, req.user.permissions) && !req.user.permissions.admin) {
                authLogger.warn('No admins can\'t update his owns permissions');
                return callback({
                    statusCode: 401,
                    message: 'You can\'t update your own permissions'
                });
            }
            callback();
        });
    }, function(callback) {
        User.update({_id: updatedUser._id}, updatedUser, function(err) {
            if(err) {
                errorLogger.error('Error updating user');
                errorLogger.error(err);
                return callback({
                    statusCode: 500,
                    message: 'Error updating user'
                });
            }
            callback();
        });
    }], function(err) {
        if(err) {
            return res.status(err.statusCode).send(err.message);
        }
        res.sendStatus(200);
    });
};

function areEqualPermissions(perm1, perm2) {
    for(var key in perm1) {
        if(perm1.hasOwnProperty(key) && perm2.hasOwnProperty(key)) {
            if(perm1[key] != perm2[key]) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}
