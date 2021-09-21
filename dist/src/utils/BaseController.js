export default class BaseController {
    request;
    response;
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    /**
     * Возвращает параметры запроса
     */
    useParams() {
        return this.request.params;
    }
    useBody() {
        return this.request.body;
    }
}
//# sourceMappingURL=BaseController.js.map