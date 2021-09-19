import http from "http";
import Express from "express";
import BlackBox from "./domains/BlackBox";
import fs from "fs";
import { blackbox } from "./index.d";
import RootModule from "./domains/RootModule";
import { LogEvents } from "./domains/Log/log.module";
import Compression from "compression";
import BodyParser from "body-parser";

/**
 * Создаем приложение
 * @param pathToConfig
 */
export function createApp(pathToConfig: string) {
    /**
     * Читаем настройки
     */
    const config = readConfig<blackbox.IConfig>(pathToConfig);

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
        rootModule.logModule?.emitter?.emit(
            LogEvents.LogError,
            error.message + " " + error.stack
        );
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
            rootModule.logModule?.emitter.emit(
                LogEvents.LogInfo,
                `server остановлен по коду ${code}`
            );

            process.exit(code);
        });
    });

    /**
     * Создаем класс приложения
     */
    const BlackBoxServer = new BlackBox(
        Server,
        config.server,
        rootModule,
        express
    );

    /**
     * Устанавливаем middleware
     */

    BlackBoxServer.use(
        Compression(config?.server?.compression || { level: 6 })
    );

    /**
     * Парсеры
     */
    const urlencodedParser = BodyParser.urlencoded(
        config?.server?.body_parser || {
            limit: "50mb",
            extended: false,
            parameterLimit: 50000,
        }
    ); // чтение данных из форм
    const jsonParser = BodyParser.json({
        limit: config?.server?.body_parser?.limit || "50mb",
    }); // чтение данных из json

    BlackBoxServer.use(urlencodedParser);
    BlackBoxServer.use(jsonParser);

    return BlackBoxServer;
}

/**
 * Читаем конфиг из файла
 * @param pathToConfig - путь до файла
 */
export function readConfig<T>(pathToConfig: string): T {
    if (!pathToConfig) throw new Error("path to config cannot be undefined!");

    let config: T;

    try {
        config = JSON.parse(fs.readFileSync(pathToConfig, "utf8"));
    } catch (e: any) {
        throw new Error(e);
    }

    return config;
}

/**
 * Коды сервера
 */
export enum ServerCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}
