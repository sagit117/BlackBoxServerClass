export default class LogService {
    logger;
    constructor(logger) {
        console.log("created LogService");
        if (!logger)
            throw new Error("logger cannot be undefined!");
        this.logger = logger;
    }
    LogInfo(info) {
        this.logger.log("INFO", info);
    }
    LogError(error) {
        this.logger.log("ERROR", error);
    }
    LogWarning(warning) {
        this.logger.log("WARNING", warning);
    }
}
//# sourceMappingURL=log.service.js.map