var path = require('path');
var webpack = require('webpack');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

var config = {
    debug: true,
    devtool: 'source-map',

    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/infrastructure/web/index.tsx'
    ],

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
            { test: /\.tsx?$/, loader: 'react-hot!ts-loader', include: path.join(__dirname, 'src'), exclude: nodeModulesPath },
            { test: /\.scss?$/, loader: 'style!css!sass', include: path.join(__dirname, 'src/infrastructure/web/', 'styles') },
            { test: /\.png$/, loader: 'file' },
            { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file'}
        ],
        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]

};

module.exports = config;
