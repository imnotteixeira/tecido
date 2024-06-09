import { Container } from "inversify";
import { TYPES } from "./types";
import { AppConfig, init as initAppConfig } from "./appConfig";
import { HomeHandler } from "../pages/home";
import { SpreadsheetHandler } from "../pages/spreadsheet";
import SpreadsheetService from "../service/spreadsheet";

const ServiceModule = new Container();
ServiceModule.bind<AppConfig>(TYPES.AppConfig).toConstantValue(initAppConfig());
ServiceModule.bind<HomeHandler>(HomeHandler).toSelf();
ServiceModule.bind<SpreadsheetHandler>(SpreadsheetHandler).toSelf();
ServiceModule.bind<SpreadsheetService>(SpreadsheetService).toSelf();

export { ServiceModule };