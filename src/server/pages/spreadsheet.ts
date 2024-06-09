import { type Request, type Response, Router } from "express";
import { AsyncPageRequestHandler, IRouteRenderHandler, PageData, PageRegisterer } from ".";
import { PageType, containerId } from "../../shared/constants";
import { SpreadsheetPageContext } from "../../shared";
import { SSRContentBuilder } from "../ssr";
import { ViteDevServer } from "vite";
import { inject, injectable } from "inversify";
import { type AppConfig } from "../module/appConfig";
import { TYPES } from "../module/types";
import SpreadsheetService from "../service/spreadsheet";

const router = Router();

@injectable()
export class SpreadsheetHandler implements IRouteRenderHandler<SpreadsheetPageContext> {
    
    @inject(TYPES.AppConfig)
    private appConfig!: AppConfig;

    @inject(SpreadsheetService)
    private spreadsheetService!: SpreadsheetService;

    constructor() {}
    
    handle: AsyncPageRequestHandler<SpreadsheetPageContext> = async (req): Promise<PageData<SpreadsheetPageContext>> => {
        
        const spreadsheets = this.spreadsheetService.getSpreadsheets()

        return {
            context: {
                pageType: PageType.SPREADSHEET,
                spreadsheetName: spreadsheets[0].spreadsheetName
            }
        }
    }

    register: PageRegisterer = (
        app: Router, 
        getTemplate: (url: string) => Promise<string>,
        renderer: SSRContentBuilder,
        viteDevServer?: ViteDevServer
    ) => {
        app.use("/spreadsheet", router);
    
        router.get("/", async (req: Request, res: Response, next: any) => {
            
            try {
                // can this be generalized? as all renderers will likely have to replace stuff and use the generic render/template
                const url = req.originalUrl.replace(this.appConfig.BASE_PATH, "")
                
                const pageResponseData = await this.handle(req);
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
}