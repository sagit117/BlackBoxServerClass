## Проект для быстрого запуска бэкенд сервисов на nodejs и express

### Установка

> npm install blackboxserverclass

### В текущей версии поддерживаются
#### Базы данных:
> MongoDB

#### Каналы связи:
> WebSocket

> RabbitMQ


### Для конфигурации приложения необходимо в корне разместить файл json

#### Пример конфига

```json
{
  "server": {
    "port": 8081,
    "compression": {
      "level": 6
    },
    "body_parser": {
      "limit": "50mb",
      "extended": false,
      "parameterLimit": 50000
    },
    "HEADERS": [
      {
        "key": "Access-Control-Allow-Origin",
        "value": "*"
      },
      {
        "key": "Access-Control-Allow-Origin",
        "value": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      },
      {
        "key": "Access-Control-Allow-Headers",
        "value": "Content-Type"
      }
    ]
  },
  "ws": {
    "use": true,
    "port": 8082
  },
  "rabbitMQ": {
    "use": true,
    "url": "amqp://root:password@172.23.16.51:5672",
    "receive_queue_name": "q_TestUserEvents",
    "receive_exchange": "ex_TestUserEvents",
    "receive_routing_key": "k_TestUserEvents",
    "send_exchange": "ex_TestUserEvents",
    "send_exchange_type": "fanout",
    "send_routing_key": "k_TestUserEvents",
    "prefetch": 10,
    "channel": {
      "receive": {
        "durable": true,
        "autoDelete": false,
        "messageTtl": 600000
      },
      "consume": {
        "noAck": false
      },
      "send": {
        "durable": true
      }
    }
  },
  "DB": {
    "mongo": {
      "use": true,
      "host": "localhost",
      "port": 27017,
      "user_name": "admin",
      "password": "paSw0rd!",
      "db_name": "blackBox",
      "string_options": "?authSource=admin"
    }
  },
  "logger": {
    "INFO": {
      "format": ["DATE", "TYPE", "MSG"],
      "color": {
        "DATE": "bold",
        "TYPE": "blue.bold.bgBlack",
        "MSG": "bold"
      },
      "type": "INFO"
    },
    "ERROR": {
      "format": ["DATE", "TYPE", "MSG"],
      "color": {
        "DATE": "bold",
        "TYPE": "red.bold.bgBlack",
        "MSG": "bold"
      },
      "type": "CRITICAL"
    },
    "WARNING": {
      "format": ["DATE", "TYPE", "MSG"],
      "color": {
        "DATE": "bold",
        "TYPE": "yellow.bold.bgBlack",
        "MSG": "bold"
      },
      "type": "WARNING"
    }
  }
}
```

#### Пример использования

```typescript
const BlackBox = BlackBoxCreateApp("./config.json");

BlackBox
    // подключаем сервер
    .listenedPort()
    // подключаем mongo
    .mongoConnect()
    // подключаем rabbit
    .rabbitConnect(true, (msg) => {
        BlackBox.log(BlackBoxLogEvents.LogInfo, msg.content.toString());
    })
    // отправка сообщений через rabbit
    .sendRabbitMsg(
        `{"date":"2021-09-17T09:20:51.387Z","scenario":"Open door","region":77,"site":108,"device":"00:E0:4C:44:A6:5D","description":"Открыта дверь"}`,
        (isOk, errorMsg) => {
            if (isOk)
                BlackBox.log(
                    BlackBoxLogEvents.LogInfo,
                    "Сообщение отправлено через RabbitMQ"
                );
            else BlackBox.log(BlackBoxLogEvents.LogError, errorMsg);
        }
    )
    // подключаем websocket
    .WSConnect(
        (msg: blackbox.WSMessage) => {
            BlackBox.log(BlackBoxLogEvents.LogInfo, "ws message:" + msg.toString());
        },
        (wss, ws) => {
            ws.send("hello");

            wss.clients.forEach((i) => i.send("hello world!"));
        }
    )
    // подключаем middleware
    .use(
        (
            req: blackbox.Request,
            _res: blackbox.Response,
            next: blackbox.NextFunction
        ) => {
            BlackBox.log(BlackBoxLogEvents.LogInfo, req.url);

            next();
        }
    )
    // переходим на инстанс Express и можем использовать его методы
    .methods()
    .get("/test/:id", (req, res, next) => {
        const { id }: { id: string } = req.params;
        res.status(BlackBoxServerCode.OK).send("OK GET");

        BlackBox.log(BlackBoxLogEvents.LogInfo, id);

        next();
    })
    .post("/testpost", (req, res, next) => {
        const params: any = req.body;
        res.status(BlackBoxServerCode.OK).send("OK POST");

        BlackBox.log(BlackBoxLogEvents.LogInfo, JSON.stringify(params));

        next();
    });

/**
 * Способ создания контроллера с автопривязкой к маршруту
 */

// обязательно помечаем декоратором с общей частью пути
@controller("/api/v1/user")
class UserController extends BaseController {
    // обязательно помечаем декоратором с методом запроса и оставшейся частью пути
    @GET("/get/:id")
    public getUser() {
        const { id } = this.useParams<{ id: number }>();

        return this.response
            .status(ServerCode.OK)
            .send({ id: id, name: "test-user" });
    }

    @POST("/set-name")
    public setUserName() {
        const { name, id } = this.useBody<{ name: string; id: number }>();

        return this.response.status(ServerCode.OK).send({ id, name });
    }
}

@controller("/api/v1/userRemove")
class RemoverController extends BaseController {
    @DELETE("/delete/:id")
    public userRemove() {
        const { id } = this.useParams<{ id: number }>();

        // throw new Error("123123");

        return this.response
            .status(ServerCode.OK)
            .send(`user id ${id} remove!`);
    }
}

// передаем контроллеры в приложение
BlackBox.addControllers([UserController, RemoverController]);
```