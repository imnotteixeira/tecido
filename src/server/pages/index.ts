import fs from "node:fs/promises"
import { Router, Request, Response } from "express";
import { HomeHandler } from "./home"
import { SpreadsheetHandler } from "./spreadsheet"
import { PageType } from "../../shared/constants";
import { ViteDevServer } from "vite";
import { SSRContentBuilder } from "../ssr.js";
import { ServiceModule } from "../module/index.js";
import { TYPES } from "../module/types.js";
import { AppConfig } from "../module/appConfig.js";

export type PageRegisterer = (router: Router, getTemplate: (url: string) => Promise<string>, renderer: SSRContentBuilder, viteDevServer?: ViteDevServer) => void

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

interface IRouteHandler {
    register: PageRegisterer
}
export interface IRouteRenderHandler<T extends PageContext> extends IRouteHandler {
    handle: PageRequestHandler<T>,
}
export interface IRouteRedirectHandler extends IRouteHandler {
    handle: PageRedirectHandler
}

const PAGE_HANDLERS: IRouteHandler[] = [
    ServiceModule.get(HomeHandler),
    ServiceModule.get(SpreadsheetHandler),
]

export default async (viteDevServer?: ViteDevServer) => {
    
    const app = Router();
    const config = ServiceModule.get<AppConfig>(TYPES.AppConfig)

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

    PAGE_HANDLERS.forEach(pageHandler => pageHandler.register(app, getTemplate, renderer, viteDevServer))

    return app;
};
