import { createApp, readConfig, ServerCode } from "./app";
import { blackbox } from "./index.d";

export const BlackBox = createApp("./config.json");
export const ReadConfig = readConfig;
export const BlackBoxServerCode = ServerCode;

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
    )
    .use(
        (
            req: blackbox.Request,
            _res: blackbox.Response,
            next: blackbox.NextFunction
        ) => {
            console.log(req.url);

            next();
        }
    )
    .methods()
    .get("/test", (_req, res, next) => {
        res.status(BlackBoxServerCode.OK).send("ok");

        next();
    });
