import { loggercolored } from "logger-colored";
import Express from "express";

export namespace blackbox {
    export interface IConfig {
        server: IConfigServer;
        logger: IloggerConfig;
        DB: {
            mongo: IConfigMongo
        },
        rabbitMQ: IConfigRabbit
    }

    export interface IConfigServer {
        port: number;
        compression: {
            level: number
        }
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

    export interface IConfigRabbit {
        use: boolean,
        url: string,
        receive_queue_name: string,
        receive_exchange: string,
        receive_routing_key: string,
        send_exchange: string,
        send_exchange_type: string,
        send_routing_key: string,
        prefetch: number
        channel: {
            receive: {
                durable: boolean,
                autoDelete: boolean,
                messageTtl: number
            },
            consume: {
                noAck: boolean,
            },
            send: {
                durable: boolean,
            }
        }
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

    export type Request = Express.Request
    export type Response = Express.Response
    export type NextFunction = Express.NextFunction
}
