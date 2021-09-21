export default class BaseModule<Emitter, Service> {
    emitter: Emitter;
    protected service: Service;
    constructor(emitter: Emitter, service: Service);
    protected addListeners(): void;
}
//# sourceMappingURL=BaseModule.d.ts.map