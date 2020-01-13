const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const config = {
    entry: {
        content: path.join(src, 'content', 'content.tsx'),
        background: path.join(src, 'background', 'background.ts')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { test: /\.css$/, use: [ 
                { loader: "style-loader" },
                { loader: "css-loader", options: { modules: true } },
            ] }, 
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.css' ],
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
