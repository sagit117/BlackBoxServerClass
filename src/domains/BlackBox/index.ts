import * as http from "http";
import { blackbox } from "../../index.d";
import RootModule from "../RootModule";
import { LogEvents } from "../Log/log.module";

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
                this.rootModule.logModule?.emitter.emit(
                    LogEvents.LogInfo,
                    `Сервер слушает порт ${port}`
                );
            })
            .on("error", (error: Error) => {
                throw new Error(error.message);
            });
    }
}
