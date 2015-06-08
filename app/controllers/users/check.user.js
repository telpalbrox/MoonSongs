var log4js = require('log4js');
var mainLogger = log4js.getLogger('main');
var errorLogger = log4js.getLogger('error');
var authLogger = log4js.getLogger('auth');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res) {
    mainLogger.trace('[File: check.user.js] | ' +
        '[Route GET /api/users/' + req.params.id +'] | ' +
        '[Function check] | ' +
        '[User id: ' + ( req.user ? req.user._id : 0) + ']');

    if(!req.body.field) {
        return res.status(400).send();
    }

    if(req.body.field !== 'userName' && req.body.field !== 'email') {
        return res.status(400).send();
    }

    var findQuery = {};
    findQuery[req.body.field] = req.params.value;
    console.log('findQuery');
    console.log(findQuery);

    User.findOne(findQuery, function(err, user) {
        if(err) {
            errorLogger.error('Error checking user');
            errorLogger.error(err);
            return;
        }
        if (!user) {
            res.json({exists: false});
            return;
        }
        console.log(user);
        res.json({exists: true});
    });
};
