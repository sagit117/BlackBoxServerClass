import LogModule from "./Log/log.module";
import LogEmitter from "./Log/emitters/log.emitter";
import ColoredLogger from "logger-colored";
import { blackbox } from "../index.d";
import LogService from "./Log/services/log.service";

/**
 * Активирует все модули
 */
export default class RootModule {
    public readonly logModule: LogModule | undefined;

    constructor(config: blackbox.IConfig) {
        console.log("created RootModule");

        if (config.logger) {
            console.log("created ColoredLogger");

            const logger = new ColoredLogger(config.logger);
            const logService = new LogService(logger);
            const logEmitter = new LogEmitter(logService);

            this.logModule = new LogModule(logEmitter, logService);
        }
    }
}
