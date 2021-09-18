import EventEmitter from "event-emitters-class";

export default class RabbitmqEmitter extends EventEmitter {
    constructor(proto?: any) {
        console.log("created RabbitmqEmitter");
        super(proto);
    }
}
