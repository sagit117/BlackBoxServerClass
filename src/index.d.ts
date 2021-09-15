import { loggercolored } from "logger-colored";

export namespace blackbox {
    export interface IConfig {
        server: IConfigServer;
        logger: IloggerConfig;
    }

    export interface IConfigServer {
        port: number;
    }

    export interface IloggerConfig extends loggercolored.IConfig {
        INFO: {
            format: loggercolored.TFormatLogger[];
            color: {
                DATE: string;
                TYPE: string;
                MSG: string;
            };
            type: string;
        };
        ERROR: {
            format: loggercolored.TFormatLogger[];
            color: {
                DATE: string;
                TYPE: string;
                MSG: string;
            };
            type: string;
        };
        WARNING: {
            format: loggercolored.TFormatLogger[];
            color: {
                DATE: string;
                TYPE: string;
                MSG: string;
            };
            type: string;
        };
    }
}
