import EventEmitter from "event-emitters-class";

export default class LogEmitter extends EventEmitter {
    constructor(proto?: any) {
        console.log("created LogEmitter");
        super(proto);
    }
}
