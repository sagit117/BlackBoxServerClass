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

        this.listenedPort(this.config?.port || defaultConfig.port);
    }

    /**
     * Слушаем сервер на порту
     * @private
     */
    private listenedPort(port: number) {
        console.log("trying to listen to the port:", port);

        this.server
            .listen(port, () => {
                this.log(LogEvents.LogInfo, `Сервер слушает порт ${port}`);

                this.rootModule.mongoModule?.emitter.emit(
                    MongoEvents.CreateConnect,
                    (conn: Promise<typeof Mongoose>) => {
                        console.log(conn);
                    }
                );
            })
            .on("error", (error: Error) => {
                throw new Error(error.message);
            });
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
