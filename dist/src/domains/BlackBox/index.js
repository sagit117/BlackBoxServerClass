import { LogEvents } from "../Log/log.module";
import { MongoEvents } from "../MongoDB/mongodb.module";
import { Error } from "mongoose";
import { RabbitEvents } from "../RabbitMQ/rabbitmq.module";
import E from "express";
import { WebsocketEvents } from "../WebSocket/websocket.module";
import routes from "../Routes";
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
    server;
    config;
    rootModule;
    express;
    constructor(server, config, rootModule, express) {
        console.log("created BlackBoxApp");
        if (!server)
            throw new Error("server cannot be undefined!");
        if (!config)
            throw new Error("config cannot be undefined!");
        this.server = server;
        this.config = config;
        this.rootModule = rootModule;
        this.express = express;
    }
    /**
     * Слушаем сервер на порту
     */
    listenedPort() {
        const port = this.config?.port || defaultConfig.port;
        this.server
            .listen(port, () => {
            this.log(LogEvents.LogInfo, `Сервер слушает порт ${port}`);
        })
            .on("error", (error) => {
            throw new Error(error.message);
        });
        return this;
    }
    /**
     * Подключаемся к mongodb
     */
    mongoConnect() {
        this.rootModule.mongoModule?.emitter.emit(MongoEvents.CreateConnect, (conn) => {
            if (conn instanceof Error) {
                throw new Error(conn.message);
            }
            else {
                this.log(LogEvents.LogInfo, "Подключились к MongoDB");
            }
        });
        return this;
    }
    /**
     * Подключение к rabbitMQ
     * @param isReconnect - флаг для переподключения в случае ошибки
     * @param cbGetMsg - callback сработает когда rabbit получит сообщение
     */
    rabbitConnect(isReconnect = false, cbGetMsg) {
        /**
         * Слушатели событий канала rabbitMQ
         */
        const rabbitChannelCb = (isOk, errorMsg, channel) => {
            if (isOk && channel) {
                channel.on("error", (error) => {
                    this.log(LogEvents.LogError, error.message);
                });
                channel.on("close", () => {
                    this.log(LogEvents.LogWarning, "Rabbit channel is closing");
                });
            }
            else {
                this.log(LogEvents.LogWarning, errorMsg);
            }
        };
        /**
         * Слушатели событий соединения rabbitMQ
         */
        const rabbitConnectCb = (isOk, errorMsg, connection) => {
            if (isOk && connection) {
                this.log(LogEvents.LogInfo, "Подключились к RabbitMQ");
                connection.on("error", (error) => {
                    this.log(LogEvents.LogError, error.message);
                    isReconnect &&
                        setTimeout(this.rabbitConnect.bind(this, isReconnect, cbGetMsg), 1000);
                });
                connection.on("close", () => {
                    this.log(LogEvents.LogWarning, "Rabbit connection is closing");
                });
            }
            else {
                throw new Error(errorMsg);
            }
        };
        this.rootModule.rabbitModule?.emitter.emit(RabbitEvents.CreateConnect, rabbitConnectCb, rabbitChannelCb, cbGetMsg);
        return this;
    }
    /**
     * Отправка сообщений через rabbitMQ
     * @param msg
     * @param callback
     */
    sendRabbitMsg(msg, callback) {
        const cb = (isOk, errorMsg, channel) => {
            channel?.on("error", (error) => {
                this.log(LogEvents.LogError, error.message);
            });
            channel?.on("close", () => {
                this.log(LogEvents.LogWarning, "Rabbit channel is closing");
            });
            callback(isOk, errorMsg);
        };
        this.rootModule.rabbitModule?.emitter.emit(RabbitEvents.SendMessage, msg, cb);
        return this;
    }
    /**
     * Соединение с WebSocket
     * @constructor
     */
    WSConnect(cbGetMessage, cbConnect) {
        this.rootModule.websocketModule?.emitter.emit(WebsocketEvents.CreateConnect, (wss, ws) => {
            /**
             * Обрабатываем то, что отправил клиент
             */
            ws.on("message", cbGetMessage);
            ws.on("error", (e) => {
                this.log(LogEvents.LogError, e.message);
                ws.send(e);
            });
            cbConnect(wss, ws);
        });
        return this;
    }
    /**
     * Логирование событий
     * @param type
     * @param msg
     * @private
     */
    log(type, msg) {
        this.rootModule.logModule?.emitter.emit(type, msg);
    }
    use(...arg) {
        this.express.use(...arg);
        return this;
    }
    methods() {
        return this.express;
    }
    /**
     * Создаем связь маршрута и контроллера
     * @param controllers
     */
    addControllers(controllers) {
        controllers.forEach((controller) => {
            const router = E.Router();
            const route = routes.getRoutes(controller.name);
            /**
             * callback для роутера
             * @param r - объект маршрута
             */
            const cb = (r) => (req, res, next) => {
                this.log(LogEvents.LogInfo, `request method: ${req.method}, url: ${route?.path || "/"}${req.url} body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)}`);
                const ctl = new controller(req, res);
                /**
                 * Соединяем маршрут с методом контроллера
                 */
                if (ctl[r.method])
                    ctl[r.method]?.();
                next();
            };
            route?.routes.forEach((r) => {
                router[r.type](r.route, cb(r));
            });
            this.use(route?.path || "/", router);
        });
        return this;
    }
}
//# sourceMappingURL=index.js.map