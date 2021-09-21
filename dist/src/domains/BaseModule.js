export default class BaseModule {
    emitter;
    service;
    constructor(emitter, service) {
        this.emitter = emitter;
        this.service = service;
        this.addListeners();
    }
    addListeners() { }
}
//# sourceMappingURL=BaseModule.js.map