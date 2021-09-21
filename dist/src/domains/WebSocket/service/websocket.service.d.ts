import { blackbox } from "../../../index.d";
import WebSocket from "ws";
export default class WebsocketService {
    private readonly config;
    constructor(config: blackbox.IWSConfig);
    create(cb: (wss: WebSocket.Server, ws: WebSocket) => void): void;
}
//# sourceMappingURL=websocket.service.d.ts.map