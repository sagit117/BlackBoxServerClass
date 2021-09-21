import BaseModule from "../BaseModule";
/**
 * События для слушателя
 */
export var MongoEvents;
(function (MongoEvents) {
    MongoEvents["CreateConnect"] = "CreateConnect";
})(MongoEvents || (MongoEvents = {}));
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class MongodbModule extends BaseModule {
    constructor(emitter, service) {
        super(emitter, service);
        console.log("created MongodbModule");
    }
    /**
     * Создаем слушатели
     */
    addListeners() {
        this.emitter.addListeners(MongoEvents.CreateConnect, this.service.connect);
    }
}
//# sourceMappingURL=mongodb.module.js.map