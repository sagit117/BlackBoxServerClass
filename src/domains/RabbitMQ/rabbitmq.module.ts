import BaseModule from "../BaseModule";
import RabbitmqEmitter from "./emitters/rabbitmq.emitter";
import RabbitmqService from "./services/rabbitmq.service";

export enum RabbitEvents {
    CreateConnect = "CreateConnect",
    SendMessage = "SendMessage",
}

export default class RabbitmqModule extends BaseModule<
    RabbitmqEmitter,
    RabbitmqService
> {
    constructor(emitter: RabbitmqEmitter, service: RabbitmqService) {
        console.log("created RabbitmqModule");

        super(emitter, service);
    }

    /**
     * Создаем слушатели
     */
    protected addListeners() {
        this.emitter.addListeners(
            RabbitEvents.CreateConnect,
            this.service.connectRabbit
        );

        this.emitter.addListeners(
            RabbitEvents.SendMessage,
            this.service.sendingMsg
        );
    }
}
