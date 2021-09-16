import { blackbox } from "../../../index.d";
import amqp from "amqplib/callback_api";
import { Error } from "mongoose";

const defaultConfig = {
    receive_bind_xmttl: 60000,
    send_exchange_type: "fanout",
    prefetch: 10,
    channel: {
        receive: {
            durable: false,
            autoDelete: true,
            consume: {
                noAck: false,
            },
        },
        send: {
            durable: true,
        },
    },
};

export default class RabbitmqService {
    private config: blackbox.IConfigRabbit;
    private connect: amqp.Connection | undefined;

    constructor(config: blackbox.IConfigRabbit) {
        console.log("created RabbitmqService");

        this.config = config;
    }

    /**
     * Соединение с rabbitMQ
     */
    public connectRabbit() {
        amqp.connect(this.config.url, (error: Error, connection) => {
            if (error) {
                // setTimeout(this.connectRabbit, 1000);
            }

            /**
             * Слушатели событий соединения
             */
            connection.on("error", (err: Error) => {
                if (err.message !== "Connection closing") {
                }

                // setTimeout(this.connectRabbit, 1000);
            });

            connection.on("close", () => {
                // setTimeout(this.connectRabbit, 1000);
            });

            /** ==== */

            /**
             * Удачный коннект
             */
            this.connect = connection;

            /**
             * Создание канала получения
             */
            this.receiveMsg();
        });
    }

    private receiveMsg() {
        this.connect?.createChannel((error, ch) => {
            if (this.closeOnErr(error)) return;

            /**
             * Процесс обработки получения сообщений
             * @param msg
             */
            const processMsg = (msg: any) => {
                work(msg, (ok: boolean) => {
                    try {
                        if (ok) ch.ack(msg);
                        else ch.reject(msg, true);
                    } catch (e: any) {
                        this.closeOnErr(e);
                    }
                });
            };

            /**
             * Слушатели событий канала
             */
            ch.on("error", (error: Error) => {
                //
            });

            ch.on("close", () => {
                //
            });

            /** ==== */

            ch.prefetch(this.config?.prefetch || defaultConfig.prefetch);

            ch.assertQueue(
                this.config.receive_queue_name,
                this.config.channel.receive,
                (err, _ok) => {
                    if (this.closeOnErr(err)) return;

                    ch.consume(
                        this.config.receive_queue_name,
                        processMsg,
                        this.config.channel.receive.consume ||
                            defaultConfig.channel.receive.consume
                    );
                }
            );

            /**
             * Байнд маршрутов
             */
            ch.bindQueue(
                this.config.receive_queue_name,
                this.config.receive_exchange || "",
                this.config.receive_routing_key || "",
                {
                    "x-message-ttl":
                        Number(this.config.receive_bind_xmttl) ||
                        defaultConfig.receive_bind_xmttl,
                }
            );
        });

        /**
         * Обработка полученных сообщений
         * @param msg
         * @param cb
         */
        function work(msg: any, cb: (ok: boolean) => void) {
            /**
             * Локальное событие с объектом статуса
             */
            // App.emit("getMessageRabbit", msg);

            cb(true);
        }
    }

    /**
     * Обработка ошибок канала и очередей
     * @param error
     */
    private closeOnErr(error: Error) {
        if (!error || !this.connect) return false;

        this.connect.close();

        return true;
    }

    /**
     * Канал для отправки
     * @param msg - сообщение для отправки
     */
    public sendingMsg(msg: string) {
        this.connect?.createChannel((error: Error, ch) => {
            if (this.closeOnErr(error)) return;

            if (!ch) return;

            /**
             * Слушатели событий канала
             */
            ch.on("error", (error: Error) => {
                //
            });

            ch.on("close", () => {
                //
            });

            /** ==== */

            ch.assertExchange(
                this.config.send_exchange,
                this.config.send_exchange_type ||
                    defaultConfig.send_exchange_type,
                this.config.channel.send || defaultConfig.channel.send
            );

            const sendingIsSuccess = ch.publish(
                this.config.send_exchange,
                this.config.send_routing_key || "",
                Buffer.from(msg)
            );

            if (sendingIsSuccess) {
                //
            }
        });
    }
}
