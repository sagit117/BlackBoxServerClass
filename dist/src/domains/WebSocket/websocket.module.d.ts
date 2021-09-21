import BaseModule from "../BaseModule";
import WebsocketEmitter from "./emitters/websocket.emitter";
import WebsocketService from "./service/websocket.service";
/**
 * События для слушателя
 */
export declare enum WebsocketEvents {
    CreateConnect = "CreateConnect"
}
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class WebsocketModule extends BaseModule<WebsocketEmitter, WebsocketService> {
    constructor(emitter: WebsocketEmitter, service: WebsocketService);
    protected addListeners(): void;
}
//# sourceMappingURL=websocket.module.d.ts.map