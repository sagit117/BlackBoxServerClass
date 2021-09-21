import LogModule from "./Log/log.module";
import { blackbox } from "../index.d";
import MongodbModule from "./MongoDB/mongodb.module";
import RabbitmqModule from "./RabbitMQ/rabbitmq.module";
import WebsocketModule from "./WebSocket/websocket.module";
/**
 * Активирует все модули
 */
export default class RootModule {
    readonly logModule: LogModule | undefined;
    readonly mongoModule: MongodbModule | undefined;
    readonly rabbitModule: RabbitmqModule | undefined;
    readonly websocketModule: WebsocketModule | undefined;
    constructor(config: blackbox.IConfig);
}
//# sourceMappingURL=RootModule.d.ts.map