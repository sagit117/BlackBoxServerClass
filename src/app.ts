import http from "http";
import Express from "express";
import BlackBox from "./domains/BlackBox";
import fs from "fs";
import { blackbox } from "./index.d";
import RootModule from "./domains/RootModule";
import { LogEvents } from "./domains/Log/log.module";

/**
 * Создаем сервер
 * @param pathToConfig
 */
export function createServer(pathToConfig: string) {
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

    const BlackBoxServer = new BlackBox(Server, config.server, rootModule);

    return BlackBoxServer;
}

/**
 * Читаем конфиг из файла
 * @param pathToConfig - путь до файла
 */
export function readConfig(pathToConfig: string): blackbox.IConfig {
    if (!pathToConfig) throw new Error("path to config cannot be undefined!");

    let config: blackbox.IConfig;

    try {
        config = JSON.parse(fs.readFileSync(pathToConfig, "utf8"));
    } catch (e: any) {
        throw new Error(e);
    }

    return config;
}
