import { blackbox } from "../index.d";

export default class BaseController {
    protected request: blackbox.Request;
    protected response: blackbox.Response;
    [k: string]: any;

    constructor(request: blackbox.Request, response: blackbox.Response) {
        this.request = request;
        this.response = response;
    }

    /**
     * Возвращает параметры запроса
     */
    public useParams<T>(): T {
        return this.request.params as unknown as T;
    }

    public useBody<T>(): T {
        return this.request.body;
    }
}
