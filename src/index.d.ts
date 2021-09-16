import { loggercolored } from "logger-colored";

export namespace blackbox {
    export interface IConfig {
        server: IConfigServer;
        logger: IloggerConfig;
        DB: {
            mongo: IConfigMongo
        }
    }

    export interface IConfigServer {
        port: number;
    }

    export interface IConfigMongo {
        use: boolean,
        host: string,
        port: number,
        user_name: string,
        password: string,
        db_name: string,
        string_options: string
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
