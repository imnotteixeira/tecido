import fs from "node:fs/promises"
import { Router, Request, Response } from "express";
import homePageHandler from "./home"
import dashboardPageHandler from "./spreadsheet"
import { PageType } from "../../shared/constants";
import { ViteDevServer } from "vite";
import { SSRContentBuilder } from "../ssr.js";
import Container from "typedi";
import { APP_CONFIG_MODULE_ID, AppConfig } from "../module/index.js";

export type PageHandler = (router: Router, getTemplate: (url: string) => Promise<string>, renderer: SSRContentBuilder, viteDevServer?: ViteDevServer) => void

export interface PageContext {
    pageType: PageType
}

export interface PageData<T extends PageContext> {
    context: T
}

export type AsyncPageRequestHandler<T extends PageContext> = (req: Request<any>) => Promise<PageData<T>>
export type SyncPageRequestHandler<T extends PageContext> = (req: Request<any>) => PageData<T>
type PageRequestHandler<T extends PageContext> = SyncPageRequestHandler<T> | AsyncPageRequestHandler<T>

export type AsyncRedirectHandler = (req: Request<any>, res: Response<any>) => Promise<void>
export type SyncRedirectHandler = (req: Request<any>, res: Response<any>) => void
type PageRedirectHandler = SyncRedirectHandler | AsyncRedirectHandler

export interface IRouteRenderHandler<T extends PageContext> {
    handle: PageRequestHandler<T>
}
export interface IRouteRedirectHandler {
    handle: PageRedirectHandler
}

const PAGE_HANDLERS = [
    homePageHandler,
    dashboardPageHandler,
]

export default async (viteDevServer?: ViteDevServer) => {
    
    const app = Router();
    const config = Container.get<AppConfig>(APP_CONFIG_MODULE_ID)

    let getTemplate: (url: string) => Promise<string>
    let renderer: SSRContentBuilder;

    // const ssrManifest = config.IS_PRODUCTION
    //     ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
    //     : undefined

    if (!config.IS_PRODUCTION) {
        // Always read fresh template in development
        getTemplate = async (url: string) => await viteDevServer!.transformIndexHtml(url, await fs.readFile('./index.html', 'utf-8'))
        renderer = (await viteDevServer!.ssrLoadModule('/src/server/ssr.tsx')).ssr
    } else {
        getTemplate = async () => await fs.readFile('./dist/client/index.html', 'utf-8')
        renderer = (await import('./dist/server/ssr.js')).ssr
    }

    const registerPage = (pageHandler: PageHandler) => pageHandler(app, getTemplate, renderer, viteDevServer)
    
    PAGE_HANDLERS.forEach(registerPage)

    return app;
};
