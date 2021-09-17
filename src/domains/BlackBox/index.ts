import * as http from "http";
import { blackbox } from "../../index.d";
import RootModule from "../RootModule";
import { LogEvents } from "../Log/log.module";
import { MongoEvents } from "../MongoDB/mongodb.module";
import { Error, Mongoose } from "mongoose";
import { RabbitEvents } from "../RabbitMQ/rabbitmq.module";
import amqp from "amqplib/callback_api";

/**
 * Конфиг по умолчанию
 */
const defaultConfig = {
    port: 8080,
};

/**
 * Основной класс приложения
 */
export default class BlackBox {
    private server: http.Server;
    private config: blackbox.IConfigServer;
    private rootModule: RootModule;

    constructor(
        server: http.Server,
        config: blackbox.IConfigServer,
        rootModule: RootModule
    ) {
        console.log("created BlackBoxApp");

        if (!server) throw new Error("server cannot be undefined!");
        if (!config) throw new Error("config cannot be undefined!");

        this.server = server;
        this.config = config;
        this.rootModule = rootModule;
    }

    /**
     * Слушаем сервер на порту
     */
    public listenedPort() {
        const port = this.config?.port || defaultConfig.port;

        this.server
            .listen(port, () => {
                this.log(LogEvents.LogInfo, `Сервер слушает порт ${port}`);
            })
            .on("error", (error: Error) => {
                throw new Error(error.message);
            });

        return this;
    }

    /**
     * Подключаемся к mongodb
     */
    public mongoConnect() {
        this.rootModule.mongoModule?.emitter.emit(
            MongoEvents.CreateConnect,
            (conn: typeof Mongoose) => {
                if (conn) {
                    this.log(LogEvents.LogInfo, "Подключились к MongoDB");
                } else {
                    throw new Error(
                        "Произошла ошибка при подключение к MongoDB"
                    );
                }
            }
        );

        return this;
    }

    /**
     * Подключение к rabbitMQ
     * @param isReconnect - флаг для переподключения в случае ошибки
     * @param cbGetMsg - callback сработает когда rabbit получит сообщение
     */
    public rabbitConnect(
        isReconnect: boolean = false,
        cbGetMsg: (msg: amqp.Message) => void
    ) {
        /**
         * Слушатели событий канала rabbitMQ
         */
        const rabbitChannelCb = (
            isOk: boolean,
            errorMsg: string,
            channel: amqp.Channel
        ) => {
            if (isOk && channel) {
                channel.on("error", (error: Error) => {
                    this.log(LogEvents.LogError, error.message);
                });

                channel.on("close", () => {
                    this.log(LogEvents.LogWarning, "Rabbit channel is closing");
                });
            } else {
                this.log(LogEvents.LogWarning, errorMsg);
            }
        };

        /**
         * Слушатели событий соединения rabbitMQ
         */
        const rabbitConnectCb = (
            isOk: boolean,
            errorMsg: string,
            connection: amqp.Connection
        ) => {
            if (isOk && connection) {
                this.log(LogEvents.LogInfo, "Подключились к RabbitMQ");

                connection.on("error", (error: Error) => {
                    this.log(LogEvents.LogError, error.message);

                    isReconnect &&
                        setTimeout(
                            this.rabbitConnect.bind(
                                this,
                                isReconnect,
                                cbGetMsg
                            ),
                            1000
                        );
                });

                connection.on("close", () => {
                    this.log(
                        LogEvents.LogWarning,
                        "Rabbit connection is closing"
                    );
                });
            } else {
                throw new Error(errorMsg);
            }
        };

        this.rootModule.rabbitModule?.emitter.emit(
            RabbitEvents.CreateConnect,
            rabbitConnectCb,
            rabbitChannelCb,
            cbGetMsg
        );

        return this;
    }

    /**
     * Отправка сообщений через rabbitMQ
     * @param msg
     * @param callback
     */
    public sendRabbitMsg(
        msg: string,
        callback: (isOk: boolean, errorMsg: string) => void
    ) {
        const cb = (isOk: boolean, errorMsg: string, channel: amqp.Channel) => {
            channel?.on("error", (error: Error) => {
                this.log(LogEvents.LogError, error.message);
            });

            channel?.on("close", () => {
                this.log(LogEvents.LogWarning, "Rabbit channel is closing");
            });

            callback(isOk, errorMsg);
        };

        this.rootModule.rabbitModule?.emitter.emit(
            RabbitEvents.SendMessage,
            msg,
            cb
        );

        return this;
    }

    /**
     * Логирование событий
     * @param type
     * @param msg
     * @private
     */
    public log(type: LogEvents, msg: string) {
        this.rootModule.logModule?.emitter.emit(type, msg);
    }
}
