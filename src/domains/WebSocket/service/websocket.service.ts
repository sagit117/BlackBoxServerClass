import { blackbox } from "../../../index.d";
import WebSocket from "ws";

export default class WebsocketService {
    private readonly config: blackbox.IWSConfig;

    constructor(config: blackbox.IWSConfig) {
        console.log("created WebsocketService");

        this.config = config;
    }

    public create(cb: (wss: WebSocket.Server, ws: WebSocket) => void) {
        const webSocketServer = new WebSocket.Server(this.config);

        webSocketServer.on("connection", (ws) => {
            cb(webSocketServer, ws);
        });
    }
}
