export default class BaseModule<Emitter, Service> {
    public emitter: Emitter;
    protected service: Service;

    constructor(emitter: Emitter, service: Service) {
        console.log("created MongodbModule");

        this.emitter = emitter;
        this.service = service;

        this.addListeners();
    }

    protected addListeners() {}
}
