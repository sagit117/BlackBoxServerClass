import { createApp, readConfig, ServerCode } from "./app";
import { blackbox } from "./index.d";
import BaseController from "./utils/BaseController";
import { GET, POST, DELETE } from "./utils/decorators";

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
    .WSConnect(
        (msg: blackbox.WSMessage) => {
            console.log("ws message:", msg.toString());
        },
        (wss, ws) => {
            ws.send("hello");

            wss.clients.forEach((i) => i.send("hello world!"));
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
    .get("/test/:id", (req, res, next) => {
        const { id }: { id: string } = req.params;
        res.status(BlackBoxServerCode.OK).send("OK GET");

        console.log(id);

        next();
    })
    .post("/testpost", (req, res, next) => {
        const params: any = req.body;
        res.status(BlackBoxServerCode.OK).send("OK POST");

        console.log(params);

        next();
    });

class TestController extends BaseController {
    @GET("/api/v1/user/get/:id")
    getUser() {
        const { id } = this.useParams<{ id: number }>();

        return this.response
            .status(ServerCode.OK)
            .send({ id: id, name: "test-user" });
    }

    @POST("/api/v1/user/set-name")
    setUserName() {
        const { name, id } = this.useBody<{ name: string; id: number }>();

        return this.response.status(ServerCode.OK).send({ id, name });
    }
}

class TestController2 extends BaseController {
    @DELETE("/api/v1/user/delete/:id")
    userRemove() {
        const { id } = this.useParams<{ id: number }>();

        return this.response
            .status(ServerCode.OK)
            .send(`user id ${id} remove!`);
    }
}

BlackBox.addControllers([TestController, TestController2]);
