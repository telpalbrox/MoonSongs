module.exports = {
    path: '/login',
    getComponent: function(nextState, cb) {
        require.ensure([], function (require: any) {
            cb(null, require('./LoginContainer.tsx').default);
        });
    }
};
