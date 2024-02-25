import { Container } from "typedi"
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom/server';
import { containerId } from '../../shared/constants';
import ssrEntryPoint from '../ssr';
import { DefaultPageProps } from "../pages";

export default (isProd: boolean, assetsPort: string) => {

    const suffix = isProd ? '.production.min.js' : '.development.js';
    
    // const assetsPath = `http://localhost:${assetsPort}`; // TODO: Maybe this needs changing for production
    const assetsPath = `https://799e-2a01-11-a10-40f0-bda0-c960-44bd-f430.ngrok-free.app`; // TODO: Maybe this needs changing for production

    const defaultPageProps: DefaultPageProps = {
        reactVersion,
        reactDomVersion,
        suffix,
        containerId,
        assetsPath
    }

    Container.set("DEFAULT_PAGE_PROPS", defaultPageProps)

    initAppConfig()
}

export interface AppConfig {
    // TODO
}

const REQUIRED_CONFIG_FIELDS: string[] = [
    // TODO
]

const initAppConfig = async () => {
    require('dotenv-flow').config();

    let missingRequiredConfig = false;
    
    REQUIRED_CONFIG_FIELDS.forEach((requiredField) => {
        if(!process.env[requiredField]) {
            console.error(`${requiredField} is a required config setting! Please set the env variable.`)
            missingRequiredConfig = true
        }
    })

    if (missingRequiredConfig) {
        process.exit(1);
    }

    const config: AppConfig = {
        // TODO
    }


    Container.set<AppConfig>("APP_CONFIG", config)
}