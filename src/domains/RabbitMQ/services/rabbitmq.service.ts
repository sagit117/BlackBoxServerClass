import { blackbox } from "../../../index.d";
import amqp from "amqplib/callback_api";

const defaultConfig = {
    send_exchange_type: "fanout",
    prefetch: 10,
    channel: {
        receive: {
            durable: false,
            autoDelete: true,
            messageTtl: 600000,
        },
        consume: {
            noAck: false,
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
     * @param callback
     */
    public connectRabbit(
        callback: (
            isOk: boolean,
            errorMsg: string,
            connection: amqp.Connection | null,
            channel: amqp.Channel | null
        ) => void
    ) {
        amqp.connect(this.config.url, (error: Error, connection) => {
            if (error) {
                callback(false, error.message, null, null);

                return;
            }

            callback(true, "", connection, null);

            /** ==== */

            /**
             * Удачный коннект
             */
            this.connect = connection;

            /**
             * Создание канала получения
             */
            this.receiveMsg(callback);
        });
    }

    private receiveMsg(
        callback: (
            isOk: boolean,
            errorMsg: string,
            connection: amqp.Connection | null,
            channel: amqp.Channel | null
        ) => void
    ) {
        this.connect?.createChannel((error, ch) => {
            if (this.closeOnErr(error)) return;

            callback(true, "", this.connect || null, ch);
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
                        this.config.channel.consume ||
                            defaultConfig.channel.consume
                    );
                }
            );

            /**
             * Байнд маршрутов
             */
            ch.bindQueue(
                this.config.receive_queue_name,
                this.config.receive_exchange || "",
                this.config.receive_routing_key || ""
            );
        });

        /**
         * Обработка полученных сообщений
         * @param msg
         * @param cb
         */
        function work(msg: amqp.Message, cb: (ok: boolean) => void) {
            console.log(msg.content.toString());
            cb(true);
        }
    }

    /**
     * Обработка ошибок канала и очередей
     * @param error
     */
    private closeOnErr(error: Error) {
        if (!error) return false;

        this.connect?.close();

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

            // /**
            //  * Слушатели событий канала
            //  */
            // ch.on("error", (error: Error) => {
            //     //
            // });
            //
            // ch.on("close", () => {
            //     //
            // });

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
