module.exports = {
    path: '/songs',
    getComponent: function(nextState, cb) {
        require.ensure([], function (require: any) {
            cb(null, require('./SongsContainer.tsx').default);
        });
    }
};
