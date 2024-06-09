import { type Request, type Response, Router } from "express";
import { IRouteRenderHandler, PageData, PageRegisterer, SyncPageRequestHandler } from ".";
import { HomePageContext } from "../../shared";
import { PageType, containerId } from "../../shared/constants";
import { SSRContentBuilder } from "../ssr"
import { ViteDevServer } from "vite";
import { inject, injectable } from "inversify";
import { type AppConfig } from "../module/appConfig";
import { TYPES } from "../module/types";

const router = Router();

@injectable()
export class HomeHandler implements IRouteRenderHandler<HomePageContext> {
    
    private appConfig: AppConfig;

    constructor(
        @inject(TYPES.AppConfig) appConfig: AppConfig
    ) {
        this.appConfig = appConfig
    }
    
    handle: SyncPageRequestHandler<HomePageContext> = (): PageData<HomePageContext> => {
        
        return {
            context: {
                pageType: PageType.HOME,
            }
        }
    }

    register: PageRegisterer = (
        app: Router, 
        getTemplate: (url: string) => Promise<string>,
        renderer: SSRContentBuilder,
        viteDevServer?: ViteDevServer
    ) => {
        app.use("/", router);
    
        router.get("/", async (req: Request, res: Response, next: any) => {
            
            try {
                // can this be generalized? as all renderers will likely have to replace stuff and use the generic render/template
                const url = req.originalUrl.replace(this.appConfig.BASE_PATH, "")
                
                const {context} = await this.handle(req);
    
                const rendered = await renderer(context)
            
                const html = (await getTemplate(url))
                  .replace(`<!--app-head-->`, rendered.head ?? '')
                  .replace(`<!--app-html-->`, rendered.html ?? '')
                  .replace(`<!--app-container-id-->`, containerId)
                  .replace(`<!--app-context-->`, encodeURI(JSON.stringify(context)))
            
                res
                    .status(200)
                    .set({ 'Content-Type': 'text/html' })
                    .send(html)
              } catch (e) {
                viteDevServer?.ssrFixStacktrace(e as Error)
                console.error((e as Error).stack)
                res.status(500).end((e as Error).stack)
              }
        })
    
    }
}

// const registerer: PageHandler = (
//     app: Router, 
//     getTemplate: (url: string) => Promise<string>,
//     renderer: SSRContentBuilder,
//     viteDevServer?: ViteDevServer
// ) => {
//     app.use("/", router);

//     router.get("/", async (req: Request, res: Response, next: any) => {
        
//         try {
//             // can this be generalized? as all renderers will likely have to replace stuff and use the generic render/template
//             const appConfig = ServiceModule.get<AppConfig>(TYPES.AppConfig)
//             const url = req.originalUrl.replace(appConfig.BASE_PATH, "")
            
//             const {context} = ServiceModule.get(HomeHandler).handle(req);

//             const rendered = await renderer(context)
        
//             const html = (await getTemplate(url))
//               .replace(`<!--app-head-->`, rendered.head ?? '')
//               .replace(`<!--app-html-->`, rendered.html ?? '')
//               .replace(`<!--app-container-id-->`, containerId)
//               .replace(`<!--app-context-->`, encodeURI(JSON.stringify(context)))
        
//             res
//                 .status(200)
//                 .set({ 'Content-Type': 'text/html' })
//                 .send(html)
//           } catch (e) {
//             viteDevServer?.ssrFixStacktrace(e as Error)
//             console.error((e as Error).stack)
//             res.status(500).end((e as Error).stack)
//           }
//     })

// }

// export default registerer;
