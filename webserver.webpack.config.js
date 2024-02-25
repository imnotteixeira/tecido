//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const PORT = process.env.PORT || 4000;

/** @type WebpackConfig */
const config = {
    entry: [
        './src/server/server.ts',
    ],
    target: "node14.18",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
    },
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    externals: [nodeExternals()],
    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: "./src/server/views",
                    to: "views"
                }
            ]
        }),
    ],

    // Add the loader for .ts files.
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /(\.css)$/,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
        ],
    },
}

module.exports = config;