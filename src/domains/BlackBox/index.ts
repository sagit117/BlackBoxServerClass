import * as http from "http";
import { blackbox } from "../../index.d";
import RootModule from "../RootModule";
import { LogEvents } from "../Log/log.module";
import { MongoEvents } from "../MongoDB/mongodb.module";
import { Mongoose } from "mongoose";

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
                    this.log(LogEvents.LogInfo, "Подключились к Mongo DB");
                } else {
                    throw new Error(
                        "Произошла ошибка при подключение к Mongo DB"
                    );
                }
            }
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
