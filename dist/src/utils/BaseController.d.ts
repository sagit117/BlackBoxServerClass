import { blackbox } from "../index.d";
export default class BaseController {
    protected request: blackbox.Request;
    protected response: blackbox.Response;
    [k: string]: any;
    constructor(request: blackbox.Request, response: blackbox.Response);
    /**
     * Возвращает параметры запроса
     */
    useParams<T>(): T;
    useBody<T>(): T;
}
//# sourceMappingURL=BaseController.d.ts.map