//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require('path');

const ASSETS_PORT = process.env.ASSETS_PORT || 4000;

console.log("Assets Webpack listening on port:", ASSETS_PORT)

/** @type WebpackConfig */
const config = {
    entry: [
        './src/client/browser.tsx',
        './src/client/basestyle.css',
        `webpack-hot-middleware/client?path=http://localhost:${ASSETS_PORT}/__webpack_hmr`
    ],
    target: "web",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            /** 
             * style-loader does not generate separate css file. 
             * For it, one should use MiniCssExtractPlugin  
             * https://stackoverflow.com/questions/45783002/webpack-not-generating-css-file
            */
            {
                test: /(\.css)$/,
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
            /** Uncomment the following to handle images */
            // {
            //     test: /\.png$/,
            //     use: [
            //       {
            //         loader: 'url-loader',
            //         options: {
            //           mimetype: 'image/png'
            //         }
            //       }
            //     ]
            // }
        ],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: "whm"
            }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
          }),
    ],
    devServer: {
        hot: true,
        compress: true,
        static: {
            directory: './dist'
        }
    },
}

module.exports = config;