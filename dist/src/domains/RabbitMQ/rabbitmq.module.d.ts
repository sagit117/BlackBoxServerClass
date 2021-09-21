import BaseModule from "../BaseModule";
import RabbitmqEmitter from "./emitters/rabbitmq.emitter";
import RabbitmqService from "./services/rabbitmq.service";
export declare enum RabbitEvents {
    CreateConnect = "CreateConnect",
    SendMessage = "SendMessage"
}
export default class RabbitmqModule extends BaseModule<RabbitmqEmitter, RabbitmqService> {
    constructor(emitter: RabbitmqEmitter, service: RabbitmqService);
    /**
     * Создаем слушатели
     */
    protected addListeners(): void;
}
//# sourceMappingURL=rabbitmq.module.d.ts.map