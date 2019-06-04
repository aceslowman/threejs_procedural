const path = require('path');
const webpack = require('webpack');

var entry = './public/js/src/App.js',
    destination = path.join(__dirname, 'public/js/dist');

module.exports = {
    entry: entry,
    output: {
        path: destination,
        filename: 'bundle.js'
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['*', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                options: {
                  presets:['env', 'react', 'stage-2']
                }
            },
            {
              test: /\.css$/,
              use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ]
    },
    optimization: {
      minimize: false,
      splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "common",
                chunks: "all"
            }
        }
      }
    },
    node: {
      fs: 'empty',
    },
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/js/dist',
      overlay: true
    },
    devtool: 'source-map'
};
