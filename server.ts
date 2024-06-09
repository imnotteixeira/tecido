import 'reflect-metadata';

import express from 'express';
import cookieParser from "cookie-parser"
import {ViteDevServer} from "vite";

import pageHandlers from "./src/server/pages"
import apiRoutes from "./src/server/api"

import { ServiceModule } from "./src/server/module"
import { AppConfig } from './src/server/module/appConfig';
import { TYPES } from './src/server/module/types';

console.info('Server booting...');

const appConfig = ServiceModule.get<AppConfig>(TYPES.AppConfig)
console.info("App Config", appConfig);

const app = express()

app.use(cookieParser())

// Add Vite or respective production middlewares
let viteDevServer: ViteDevServer | undefined;
if (!appConfig.IS_PRODUCTION) {
  const { createServer } = await import("vite")
  viteDevServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: appConfig.BASE_PATH
  })
  app.use(viteDevServer.middlewares)
} else {
  const compression = (await import("compression")).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(appConfig.BASE_PATH, sirv('./dist/client', { extensions: [] }))
}

// app.set("view engine", "ejs")
// app.set('views', path.join(__dirname, './views'))

// Page Handlers
app.use("/", await pageHandlers(viteDevServer))

// API endpoints
app.use("/api", apiRoutes())

app.listen(appConfig.PORT, () => { console.info(`Server started! Listening on ${appConfig.PORT}`) })