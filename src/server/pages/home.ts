import { Router } from "express";
import Container, { Inject, Service } from "typedi";
import { DefaultPageProps, IRouteRenderHandler, PageData, PageHandler, PageResponse, SyncPageRequestHandler } from ".";
import { HomePageContext } from "../../shared";
import { PageId, PageType } from "../../shared/constants";
import ssrEntryPoint from "../ssr"

const router = Router();
@Service()
class HomeHandler implements IRouteRenderHandler<HomePageContext> {
    
    @Inject("DEFAULT_PAGE_PROPS")
    defaultPageProps: DefaultPageProps;

    constructor() {}
    
    handle: SyncPageRequestHandler<HomePageContext> = (): PageData<HomePageContext> => {
        
        return {
            pageId: PageId.INDEX,
            defaultPageProps: this.defaultPageProps,
            context: {
                pageType: PageType.HOME,
            }
        }
    }
}

const registerer: PageHandler = (app: Router) => {
    app.use("/", router);

    router.get("/", (req: any, res: PageResponse, next: any) => {
        const pageResponseData = Container.get(HomeHandler).handle(req);

        const pageContext = pageResponseData.context

        res.render(pageResponseData.pageId, {
            defaultPageProps: pageResponseData.defaultPageProps,
            body: ssrEntryPoint(pageContext),
            context: JSON.stringify(pageContext)
        })
    })

}

export default registerer;
