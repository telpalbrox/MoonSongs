'use strict';
const path = require('path');
const webpack = require('webpack');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const production = process.env.NODE_ENV === 'production';
const del = require('del');
del('./public');

let plugins = [
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': production? JSON.stringify('production') : JSON.stringify('development')
        },
        __DEVELOPMENT__: !production,
        __DEVTOOLS__:    !production
    })
];
let preLoaders = [];
let entry = [
    './src/infrastructure/web/index.tsx'
];

if(!production) {
    entry = entry.concat(['webpack-hot-middleware/client?reload=true']);
    preLoaders = preLoaders.concat([
        { test: /\.js$/, loader: "source-map-loader" }
    ]);
    plugins = plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]);
}

if(production) {
    plugins = plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
}

var config = {
    debug: !production,
    devtool: production ? false : 'source-map',

    entry,

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },

    resolve: {
        root: [path.resolve(__dirname)],
        extensions: ["", ".ts", ".tsx", ".js", ".css", ".scss", "jsx"],
        node_modules: ["node_modules"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: `${production ? 'babel' : 'react-hot'}!ts-loader`, include: path.join(__dirname, 'src'), exclude: nodeModulesPath },
            { test: /\.scss?$/, loader: 'style!css!sass' },
            { test: /\.css/, loader: 'style!css' },
            { test: /\.png$/, loader: 'file' },
            { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file'}
        ],
        preLoaders
    },

    plugins
};

module.exports = config;
