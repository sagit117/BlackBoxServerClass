import { blackbox } from "../../../index.d";

export default class WebsocketService {
    private config: blackbox.IWSConfig;

    constructor(config: blackbox.IWSConfig) {
        console.log("created WebsocketService");

        this.config = config;
    }

    public create() {}
}
