import http from "http";
import Express from "express";
import BlackBox from "./domains/BlackBox";
import fs from "fs";
import RootModule from "./domains/RootModule";
import { LogEvents } from "./domains/Log/log.module";
import Compression from "compression";
import BodyParser from "body-parser";
/**
 * Создаем приложение
 * @param pathToConfig - путь до json-файла конфигураций
 */
export function createApp(pathToConfig) {
    /**
     * Читаем настройки
     */
    const config = readConfig(pathToConfig);
    /**
     * Подключаем модули
     */
    const rootModule = new RootModule(config);
    /**
     * Создаем сервер
     */
    const express = Express();
    const Server = http.createServer(express);
    /**
     * Обработчики неизвестных ошибок
     */
    process.on("uncaughtException", (error) => {
        rootModule.logModule?.emitter?.emit(LogEvents.LogError, error.message + " " + error.stack);
        process.exit(1);
    });
    /**
     * Обработчик ошибок в promises
     */
    process.on("unhandledRejection", (reason, _promise) => {
        rootModule.logModule?.emitter?.emit(LogEvents.LogError, reason);
    });
    /**
     * Обработчики выхода
     */
    const exits = ["exit", "SIGTERM", "SIGINT", "SIGHUP", "SIGQUIT"];
    exits.forEach((event) => {
        process.on(event, (code) => {
            rootModule.logModule?.emitter.emit(LogEvents.LogInfo, `server остановлен по коду ${code}`);
            process.exit(code);
        });
    });
    /**
     * Создаем класс приложения
     */
    const BlackBoxServer = new BlackBox(Server, config.server, rootModule, express);
    /**
     * Устанавливаем middleware
     */
    BlackBoxServer.use(Compression(config?.server?.compression || { level: 6 }));
    /**
     * Парсеры
     */
    const urlencodedParser = BodyParser.urlencoded(config?.server?.body_parser || {
        limit: "50mb",
        extended: false,
        parameterLimit: 50000,
    }); // чтение данных из форм
    const jsonParser = BodyParser.json({
        limit: config?.server?.body_parser?.limit || "50mb",
    }); // чтение данных из json
    BlackBoxServer.use(urlencodedParser);
    BlackBoxServer.use(jsonParser);
    /**
     * Установка заголовков
     * @param _request
     * @param response
     * @param next
     */
    function setHeader(_request, response, next) {
        const headers = config.server?.HEADERS;
        if (headers && Array.isArray(headers)) {
            headers.forEach((head) => {
                response.setHeader(head?.key, head?.value);
            });
        }
        next();
    }
    BlackBoxServer.use(setHeader);
    return BlackBoxServer;
}
/**
 * Читаем конфиг из файла
 * @param pathToConfig - путь до файла
 */
export function readConfig(pathToConfig) {
    if (!pathToConfig)
        throw new Error("path to config cannot be undefined!");
    let config;
    try {
        config = JSON.parse(fs.readFileSync(pathToConfig, "utf8"));
    }
    catch (e) {
        throw new Error(e);
    }
    return config;
}
/**
 * Коды сервера
 */
export var ServerCode;
(function (ServerCode) {
    ServerCode[ServerCode["OK"] = 200] = "OK";
    ServerCode[ServerCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ServerCode[ServerCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ServerCode[ServerCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    ServerCode[ServerCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ServerCode[ServerCode["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    ServerCode[ServerCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(ServerCode || (ServerCode = {}));
//# sourceMappingURL=app.js.map