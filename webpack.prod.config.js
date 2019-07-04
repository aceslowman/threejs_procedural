const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
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
                  presets: ['@babel/env', '@babel/react', '@babel/stage-2', '@babel/plugin-proposal-class-properties']
                }
            }
        ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "common",
                filename: 'common.bundle.js',
                chunks: "all"
            }
        }
      }
    },
    node: {
      fs: 'empty',
    }
};
