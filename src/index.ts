import { createApp, readConfig } from "./app";

export const BlackBox = createApp("./config.json");
export const ReadConfig = readConfig;

BlackBox.listenedPort()
    .mongoConnect()
    .rabbitConnect(true, (msg) => {
        console.log(msg.content.toString());
    });
