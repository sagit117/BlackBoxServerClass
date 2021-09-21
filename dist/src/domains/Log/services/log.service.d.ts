import ColoredLogger from "logger-colored";
export default class LogService {
    private readonly logger;
    constructor(logger: ColoredLogger);
    LogInfo(info: string): void;
    LogError(error: string): void;
    LogWarning(warning: string): void;
}
//# sourceMappingURL=log.service.d.ts.map