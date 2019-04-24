const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
let WebpackNotifierPlugin = require('webpack-notifier');

var entry = './public/js/App.js',
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
              test: /\.(glsl|vs|fs|vert|frag)$/,
              exclude: [/node_modules/],
              use: [
                'raw-loader',
                'glslify-loader'
              ]
            }
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
    plugins: [
      new Dotenv()
    ],
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/js/dist',
      port: 3000,
      overlay: true
    },
    devtool: 'source-map'
};
