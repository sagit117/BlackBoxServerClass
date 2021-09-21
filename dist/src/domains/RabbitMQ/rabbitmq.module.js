import BaseModule from "../BaseModule";
export var RabbitEvents;
(function (RabbitEvents) {
    RabbitEvents["CreateConnect"] = "CreateConnect";
    RabbitEvents["SendMessage"] = "SendMessage";
})(RabbitEvents || (RabbitEvents = {}));
export default class RabbitmqModule extends BaseModule {
    constructor(emitter, service) {
        console.log("created RabbitmqModule");
        super(emitter, service);
    }
    /**
     * Создаем слушатели
     */
    addListeners() {
        this.emitter.addListeners(RabbitEvents.CreateConnect, this.service.connectRabbit);
        this.emitter.addListeners(RabbitEvents.SendMessage, this.service.sendingMsg);
    }
}
//# sourceMappingURL=rabbitmq.module.js.map