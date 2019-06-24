const path = require('path');
const webpack = require('webpack');

var entry = './public/js/src/App.js',
    destination = path.join(__dirname, 'public/js/dist');

module.exports = {
    entry: './public/js/src/utilities/raytracing.worker.js',
    output: {
        path: destination,
        filename: 'raytracing.worker.bundled.js'
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['*', '.js', '.json']
    },
    node: {
        fs: 'empty',
    },
    devtool: 'source-map'
};
