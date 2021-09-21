/// <reference types="node" />
import * as http from "http";
import { blackbox } from "../../index.d";
import RootModule from "../RootModule";
import { LogEvents } from "../Log/log.module";
import amqp from "amqplib/callback_api";
import E from "express";
import WebSocket from "ws";
import BaseController from "../../utils/BaseController";
/**
 * Основной класс приложения
 */
export default class BlackBox {
    private server;
    private config;
    private rootModule;
    private readonly express;
    constructor(server: http.Server, config: blackbox.IConfigServer, rootModule: RootModule, express: E.Express);
    /**
     * Слушаем сервер на порту
     */
    listenedPort(): this;
    /**
     * Подключаемся к mongodb
     */
    mongoConnect(): this;
    /**
     * Подключение к rabbitMQ
     * @param isReconnect - флаг для переподключения в случае ошибки
     * @param cbGetMsg - callback сработает когда rabbit получит сообщение
     */
    rabbitConnect(isReconnect: boolean | undefined, cbGetMsg: (msg: amqp.Message) => void): this;
    /**
     * Отправка сообщений через rabbitMQ
     * @param msg
     * @param callback
     */
    sendRabbitMsg(msg: string, callback: (isOk: boolean, errorMsg: string) => void): this;
    /**
     * Соединение с WebSocket
     * @constructor
     */
    WSConnect(cbGetMessage: (msg: blackbox.WSMessage) => void, cbConnect: (wss: WebSocket.Server, ws: WebSocket) => void): this;
    /**
     * Логирование событий
     * @param type
     * @param msg
     * @private
     */
    log(type: LogEvents, msg: string): void;
    use(...arg: any[]): this;
    methods(): E.Express;
    /**
     * Создаем связь маршрута и контроллера
     * @param controllers
     */
    addControllers(controllers: typeof BaseController[]): this;
}
//# sourceMappingURL=index.d.ts.map