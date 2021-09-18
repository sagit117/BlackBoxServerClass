import ColoredLogger from "logger-colored";

export default class LogService {
    private readonly logger: ColoredLogger;

    constructor(logger: ColoredLogger) {
        console.log("created LogService");

        if (!logger) throw new Error("logger cannot be undefined!");

        this.logger = logger;
    }

    public LogInfo(info: string) {
        this.logger.log("INFO", info);
    }

    public LogError(error: string) {
        this.logger.log("ERROR", error);
    }

    public LogWarning(warning: string) {
        this.logger.log("WARNING", warning);
    }
}
