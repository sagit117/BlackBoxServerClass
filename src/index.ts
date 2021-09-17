import { createApp, readConfig } from "./app";

export const BlackBox = createApp("./config.json");
export const ReadConfig = readConfig;

BlackBox.listenedPort()
    .mongoConnect()
    .rabbitConnect(true, (msg) => {
        console.log(msg.content.toString());
    })
    .sendRabbitMsg(
        `{"date":"2021-09-17T09:20:51.387Z","scenario":"Open door","region":77,"site":108,"device":"00:E0:4C:44:A6:5D","description":"Открыта дверь"}`,
        (isOk, errorMsg) => {
            console.log("isOk:", isOk, "errorMsg:", errorMsg);
        }
    );
