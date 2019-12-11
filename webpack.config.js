const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const config = {
    entry: {
        content: path.join(src, 'doubleclick.js'),
        background: path.join(src, 'background.js')
    },
    output: {
        filename: '[name].js',
        path: dist
    },
    optimization: {
        minimize: false
    }
};

module.exports = config;
