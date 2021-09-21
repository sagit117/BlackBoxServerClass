import MongodbEmitter from "./emitters/mongodb.emitter";
import MongodbService from "./services/mongodb.service";
import BaseModule from "../BaseModule";
/**
 * События для слушателя
 */
export declare enum MongoEvents {
    CreateConnect = "CreateConnect"
}
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class MongodbModule extends BaseModule<MongodbEmitter, MongodbService> {
    constructor(emitter: MongodbEmitter, service: MongodbService);
    /**
     * Создаем слушатели
     */
    protected addListeners(): void;
}
//# sourceMappingURL=mongodb.module.d.ts.map