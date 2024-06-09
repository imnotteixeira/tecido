import Container, { Service } from "typedi"
import { type Request, type Response, Router } from "express";
import { AsyncPageRequestHandler, IRouteRenderHandler, PageData, PageHandler } from ".";
import { PageType, containerId } from "../../shared/constants";
import StravaService from "../service/strava";
import { SpreadsheetPageContext } from "../../shared";
import { SSRContentBuilder } from "../ssr";
import { ViteDevServer } from "vite";
import { APP_CONFIG_MODULE_ID, AppConfig } from "../module";

const router = Router();

@Service()
class SpreadsheetHandler implements IRouteRenderHandler<SpreadsheetPageContext> {
    
    constructor(
        public stravaService: StravaService
    ) {}
    
    handle: AsyncPageRequestHandler<SpreadsheetPageContext> = async (req): Promise<PageData<SpreadsheetPageContext>> => {
        
        return {
            context: {
                pageType: PageType.SPREADSHEET,
                spreadsheetName: "Dummy Spreadsheet"
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
    app.use("/spreadsheet", router);

    router.get("/", async (req: Request, res: Response, next: any) => {
        
        try {
            // can this be generalized? as all renderers will likely have to replace stuff and use the generic render/template
            const appConfig = Container.get<AppConfig>(APP_CONFIG_MODULE_ID)
            const url = req.originalUrl.replace(appConfig.BASE_PATH, "")
            
            const pageResponseData = await Container.get(SpreadsheetHandler).handle(req);
            const pageContext = pageResponseData.context;

            const rendered = await renderer(pageContext)
        
            const html = (await getTemplate(url))
              .replace(`<!--app-head-->`, rendered.head ?? '')
              .replace(`<!--app-html-->`, rendered.html ?? '')
              .replace(`<!--app-container-id-->`, containerId)
              .replace(`<!--app-context-->`, encodeURI(JSON.stringify(pageContext)))
        
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
