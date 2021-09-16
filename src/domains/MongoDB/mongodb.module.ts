import MongodbEmitter from "./emitters/mongodb.emitter";
import MongodbService from "./services/mongodb.service";

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
export default class MongodbModule {
    public emitter: MongodbEmitter;
    private service: MongodbService;

    constructor(emitter: MongodbEmitter, service: MongodbService) {
        console.log("created MongodbModule");

        this.emitter = emitter;
        this.service = service;

        this.addListeners();
    }

    /**
     * Создаем слушатели mongo
     * @private
     */
    private addListeners() {
        console.log("created listeners for mongo");

        this.emitter.addListeners(
            MongoEvents.CreateConnect,
            this.service.connect
        );
    }
}
