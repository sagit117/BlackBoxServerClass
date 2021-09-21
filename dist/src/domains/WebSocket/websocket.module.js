import BaseModule from "../BaseModule";
/**
 * События для слушателя
 */
export var WebsocketEvents;
(function (WebsocketEvents) {
    WebsocketEvents["CreateConnect"] = "CreateConnect";
})(WebsocketEvents || (WebsocketEvents = {}));
/**
 * Модуль связывает логику с внешними модулями
 * @param emitter
 * @param service
 */
export default class WebsocketModule extends BaseModule {
    constructor(emitter, service) {
        super(emitter, service);
        console.log("created WebsocketModule");
    }
    addListeners() {
        this.emitter.addListeners(WebsocketEvents.CreateConnect, this.service.create);
    }
}
//# sourceMappingURL=websocket.module.js.map