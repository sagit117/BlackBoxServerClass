import LogModule from "./Log/log.module";
import LogEmitter from "./Log/emitters/log.emitter";
import ColoredLogger from "logger-colored";
import { blackbox } from "../index.d";
import LogService from "./Log/services/log.service";
import MongodbService from "./MongoDB/services/mongodb.service";
import MongodbEmitter from "./MongoDB/emitters/mongodb.emitter";
import MongodbModule from "./MongoDB/mongodb.module";
import RabbitmqService from "./RabbitMQ/services/rabbitmq.service";
import RabbitmqEmitter from "./RabbitMQ/emitters/rabbitmq.emitter";
import RabbitmqModule from "./RabbitMQ/rabbitmq.module";

/**
 * Активирует все модули
 */
export default class RootModule {
    public readonly logModule: LogModule | undefined;
    public readonly mongoModule: MongodbModule | undefined;
    public readonly rabbitModule: RabbitmqModule | undefined;

    constructor(config: blackbox.IConfig) {
        console.log("created RootModule");

        /**
         * Подключаем модуль логгера
         */
        if (config.logger) {
            console.log("created ColoredLogger");

            const logger = new ColoredLogger(config.logger);
            const logService = new LogService(logger);
            const logEmitter = new LogEmitter(logService);

            this.logModule = new LogModule(logEmitter, logService);
        }

        /**
         * Подключаем модуль mongo
         */
        if (config.DB?.mongo?.use) {
            const mongoService = new MongodbService(config.DB.mongo);
            const mongoEmitter = new MongodbEmitter(mongoService);

            this.mongoModule = new MongodbModule(mongoEmitter, mongoService);
        }

        /**
         * Подключение к rabbit
         */
        if (config.rabbitMQ?.use) {
            const rabbitService = new RabbitmqService(config.rabbitMQ);
            const rabbitEmitter = new RabbitmqEmitter(rabbitService);

            this.rabbitModule = new RabbitmqModule(
                rabbitEmitter,
                rabbitService
            );
        }
    }
}
