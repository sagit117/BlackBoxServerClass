import LogEmitter from "./emitters/log.emitter";
import LogService from "./services/log.service";
import BaseModule from "../BaseModule";

/**
 * События для слушателя логгера
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
export default class LogModule extends BaseModule<LogEmitter, LogService> {
    constructor(emitter: LogEmitter, service: LogService) {
        super(emitter, service);

        console.log("created LogModule");
    }

    /**
     * Создаем слушатели логгера
     * @private
     */
    protected addListeners() {
        this.emitter.addListeners(LogEvents.LogInfo, this.service.LogInfo);
        this.emitter.addListeners(LogEvents.LogError, this.service.LogError);
        this.emitter.addListeners(
            LogEvents.LogWarning,
            this.service.LogWarning
        );
    }
}
