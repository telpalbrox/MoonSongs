var path = require('path');
var webpack = require('webpack');

var config = {
    entry: ['./src/infrastructure/web/index.tsx'],

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },

    resolve: {
        root: [path.resolve(__dirname, 'src')],
        extensions: ['', '.ts', '.tsx', '.js']
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'babel!ts-loader', include: path.join(__dirname, 'src') },
            { test: /\.scss?$/, loader: 'style!css!sass', include: path.join(__dirname, 'src/infrastructure/web/', 'styles') },
            { test: /\.png$/, loader: 'file' },
            { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file'}
        ],
        preLoaders: [
            { test: /\.js$/, loader: 'source-map-loader' }
        ]
    },


    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]

};

module.exports = config;
