import BaseModule from "../BaseModule";
/**
 * События для слушателя логгера
 */
export var LogEvents;
(function (LogEvents) {
    LogEvents["LogInfo"] = "LogInfo";
    LogEvents["LogError"] = "LogError";
    LogEvents["LogWarning"] = "LogWarning";
})(LogEvents || (LogEvents = {}));
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class LogModule extends BaseModule {
    constructor(emitter, service) {
        super(emitter, service);
        console.log("created LogModule");
    }
    /**
     * Создаем слушатели логгера
     * @private
     */
    addListeners() {
        this.emitter.addListeners(LogEvents.LogInfo, this.service.LogInfo);
        this.emitter.addListeners(LogEvents.LogError, this.service.LogError);
        this.emitter.addListeners(LogEvents.LogWarning, this.service.LogWarning);
    }
}
//# sourceMappingURL=log.module.js.map