import EventEmitter from "event-emitters-class";
export default class LogEmitter extends EventEmitter {
    constructor(proto) {
        console.log("created LogEmitter");
        super(proto);
    }
}
//# sourceMappingURL=log.emitter.js.map