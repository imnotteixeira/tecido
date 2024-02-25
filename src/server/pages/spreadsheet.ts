import Container, { Inject, Service } from "typedi"
import { Router } from "express";
import { AsyncPageRequestHandler, DefaultPageProps, IRouteRenderHandler, PageData, PageHandler, PageResponse } from ".";
import { PageId, PageType } from "../../shared/constants";
import StravaService from "../service/strava";
import { SpreadsheetPageContext } from "../../shared";
import ssrEntryPoint from "../ssr";

const router = Router();

@Service()
class SpreadsheetHandler implements IRouteRenderHandler<SpreadsheetPageContext> {
    
    @Inject("DEFAULT_PAGE_PROPS")
    defaultPageProps: DefaultPageProps;

    constructor(
        public stravaService: StravaService
    ) {}
    
    handle: AsyncPageRequestHandler<SpreadsheetPageContext> = async (req): Promise<PageData<SpreadsheetPageContext>> => {
        
        return {
            pageId: PageId.INDEX,
            defaultPageProps: this.defaultPageProps,
            context: {
                pageType: PageType.SPREADSHEET,
                spreadsheetName: "Dummy Spreadsheet"
            }
        }
    }
}

const registerer: PageHandler = (app: Router) => {
    app.use("/spreadsheet", router);

    router.get("/", async (req: any, res: PageResponse, next: any) => {
        const pageResponseData = await Container.get(SpreadsheetHandler).handle(req);

        const pageContext = pageResponseData.context;

        res.render(pageResponseData.pageId, {
            defaultPageProps: pageResponseData.defaultPageProps,
            body: ssrEntryPoint(pageContext),
            context: JSON.stringify(pageContext)
        })
    })

}

export default registerer;
