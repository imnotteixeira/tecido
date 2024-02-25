import 'reflect-metadata';

import express from 'express';
import cookieParser from "cookie-parser"
import path from 'path';

import pageHandlers from "./pages"
import apiRoutes from "./api"

import webpack from "webpack";
const assetsWebpackConfig = require("../../assets.webpack.config.js");

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import init from "./module"

console.log('Server booting...');
const isProd = process.env.NODE_ENV === 'production';
console.log('Production optimization enabled? ', isProd);

const PORT = process.env.PORT || "4001";
const ASSETS_PORT = process.env.ASSETS_PORT || "4000";

init(isProd, ASSETS_PORT);

const app = express()

app.use(cookieParser())
app.use("/assets", express.static("assets"))

// Enable Webpack Dev Server in Dev Mode only
if(!isProd) {

    const compiler = webpack({
        ...assetsWebpackConfig,
        mode: "development"
    })

    app.use(webpackDevMiddleware(compiler, {
        publicPath: assetsWebpackConfig.output.publicPath,
        serverSideRender: true,
    }))
    
    app.use(webpackHotMiddleware(compiler))
}

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, './views'))

// Page Handlers
app.use("/", pageHandlers())

// API endpoints
app.use("/api", apiRoutes())

app.listen(PORT, () => { console.log(`Server started! Listening on ${PORT}`) })