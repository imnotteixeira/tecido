import { config as initDotenvConfig } from "dotenv-flow"

export interface AppConfig {
    IS_PRODUCTION: boolean,
    BASE_PATH: string
    PORT: number
}

const REQUIRED_CONFIG_FIELDS: string[] = [
    // TODO
]

export const init = () => {
    
    initDotenvConfig();

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
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        BASE_PATH: process.env.BASE_PATH || '/',
        PORT: parseInt(process.env.PORT || "5173")
    }

    return config;
}