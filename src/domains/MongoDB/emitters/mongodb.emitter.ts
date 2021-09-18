import EventEmitter from "event-emitters-class";

export default class MongodbEmitter extends EventEmitter {
    constructor(proto?: any) {
        console.log("created MongodbEmitter");
        super(proto);
    }
}
