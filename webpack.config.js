const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const config = {
    entry: {
        content: path.join(src, 'content', 'content.tsx'),
        background: path.join(src, 'background', 'background.ts'),
        settings: path.join(src, 'settings', 'settings.tsx')
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
            ] }
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
        minimize: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'settings.html',
            template: path.join(src, 'settings', 'settings.html'),
            inject: false
        })
    ]
};

module.exports = config;
