import { type Request, type Response, Router } from "express";
import Container, { Service } from "typedi";
import { IRouteRenderHandler, PageData, PageHandler, SyncPageRequestHandler } from ".";
import { HomePageContext } from "../../shared";
import { PageType, containerId } from "../../shared/constants";
import { SSRContentBuilder } from "../ssr"
import { ViteDevServer } from "vite";
import { APP_CONFIG_MODULE_ID, AppConfig } from "../module";

const router = Router();
@Service()
class HomeHandler implements IRouteRenderHandler<HomePageContext> {
    
    constructor() {}
    
    handle: SyncPageRequestHandler<HomePageContext> = (): PageData<HomePageContext> => {
        
        return {
            context: {
                pageType: PageType.HOME,
            }
        }
    }
}

const registerer: PageHandler = (
    app: Router, 
    getTemplate: (url: string) => Promise<string>,
    renderer: SSRContentBuilder,
    viteDevServer?: ViteDevServer
) => {
    app.use("/", router);

    router.get("/", async (req: Request, res: Response, next: any) => {
        
        try {
            // can this be generalized? as all renderers will likely have to replace stuff and use the generic render/template
            const appConfig = Container.get<AppConfig>(APP_CONFIG_MODULE_ID)
            const url = req.originalUrl.replace(appConfig.BASE_PATH, "")
            
            const {context} = Container.get(HomeHandler).handle(req);

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

export default registerer;
