// Anything in this file can be accessible by Backend as well as Frontend

import { PageContext } from "../server/pages"

export {PageContext as PageContext} from "../server/pages"

export interface HomePageContext extends PageContext {}
export interface SpreadsheetPageContext extends PageContext {
    spreadsheetName: string
}
