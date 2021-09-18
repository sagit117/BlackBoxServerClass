import MongodbEmitter from "./emitters/mongodb.emitter";
import MongodbService from "./services/mongodb.service";
import BaseModule from "../BaseModule";

/**
 * События для слушателя
 */
export enum MongoEvents {
    CreateConnect = "CreateConnect",
}

/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class MongodbModule extends BaseModule<
    MongodbEmitter,
    MongodbService
> {
    constructor(emitter: MongodbEmitter, service: MongodbService) {
        super(emitter, service);

        console.log("created MongodbModule");
    }

    /**
     * Создаем слушатели
     */
    protected addListeners() {
        this.emitter.addListeners(
            MongoEvents.CreateConnect,
            this.service.connect
        );
    }
}
