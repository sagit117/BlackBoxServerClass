import BlackBox from "./domains/BlackBox";
/**
 * Создаем приложение
 * @param pathToConfig - путь до json-файла конфигураций
 */
export declare function createApp(pathToConfig: string): BlackBox;
/**
 * Читаем конфиг из файла
 * @param pathToConfig - путь до файла
 */
export declare function readConfig<T>(pathToConfig: string): T;
/**
 * Коды сервера
 */
export declare enum ServerCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500
}
//# sourceMappingURL=app.d.ts.map