import LogEmitter from "./emitters/log.emitter";
import LogService from "./services/log.service";
import BaseModule from "../BaseModule";
/**
 * События для слушателя логгера
 */
export declare enum LogEvents {
    LogInfo = "LogInfo",
    LogError = "LogError",
    LogWarning = "LogWarning"
}
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class LogModule extends BaseModule<LogEmitter, LogService> {
    constructor(emitter: LogEmitter, service: LogService);
    /**
     * Создаем слушатели логгера
     * @private
     */
    protected addListeners(): void;
}
//# sourceMappingURL=log.module.d.ts.map