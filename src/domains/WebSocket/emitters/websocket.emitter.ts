import EventEmitter from "event-emitters-class";

export default class WebsocketEmitter extends EventEmitter {
    constructor(proto?: any) {
        console.log("created WebsocketEmitter");
        super(proto);
    }
}
