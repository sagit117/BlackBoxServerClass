import LogEmitter from "./emitters/log.emitter";
import LogService from "./services/log.service";

/**
 * События для слушателя логера
 */
export enum LogEvents {
    LogInfo = "LogInfo",
    LogError = "LogError",
    LogWarning = "LogWarning",
}

/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class LogModule {
    public emitter: LogEmitter;
    private service: LogService;

    constructor(emitter: LogEmitter, service: LogService) {
        console.log("created LogModule");

        this.emitter = emitter;
        this.service = service;

        this.addListeners();
    }

    /**
     * Создаем слушатели логера
     * @private
     */
    private addListeners() {
        console.log("created listeners for logger");

        this.emitter.addListeners(LogEvents.LogInfo, this.service.LogInfo);
        this.emitter.addListeners(LogEvents.LogError, this.service.LogError);
        this.emitter.addListeners(
            LogEvents.LogWarning,
            this.service.LogWarning
        );
    }
}
