import WebSocket from "ws";
export default class WebsocketService {
    config;
    constructor(config) {
        console.log("created WebsocketService");
        this.config = config;
    }
    create(cb) {
        const webSocketServer = new WebSocket.Server(this.config);
        webSocketServer.on("connection", (ws) => {
            cb(webSocketServer, ws);
        });
    }
}
//# sourceMappingURL=websocket.service.js.map