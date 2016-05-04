module.exports = {
    getComponent: function(nextState, cb) {
        require.ensure([], function(require: any) {
            cb(null, require('./HomePage.tsx').default);
        });
    }
};

// export default homeRoute;
