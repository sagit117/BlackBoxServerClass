import { blackbox } from "../../../index.d";
import amqp from "amqplib/callback_api";
import { waitConnect } from "../rabbitmq.service.utils";

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
     * @param callbackConnect
     * @param callbackChannel
     * @param cbGetMessage
     */
    public connectRabbit(
        callbackConnect: (
            isOk: boolean,
            errorMsg: string,
            connection: amqp.Connection | null
        ) => void,
        callbackChannel: (
            isOk: boolean,
            errorMsg: string,
            channel: amqp.Channel | null
        ) => void,
        cbGetMessage: (msg: amqp.Message) => void
    ) {
        amqp.connect(this.config.url, (error: Error, connection) => {
            if (error) {
                callbackConnect(false, error.message, null);

                return;
            }

            callbackConnect(true, "", connection);

            /** ==== */

            /**
             * Удачный коннект
             */
            this.connect = connection;

            /**
             * Создание канала получения
             */
            this.receiveMsg(callbackChannel, cbGetMessage);
        });
    }

    private receiveMsg(
        callbackChannel: (
            isOk: boolean,
            errorMsg: string,
            channel: amqp.Channel | null
        ) => void,
        cbGetMessage: (msg: amqp.Message) => void
    ) {
        this.connect?.createChannel((error, ch) => {
            if (this.closeOnErr(error)) return;

            callbackChannel(true, "", ch);

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
                            defaultConfig.channel.consume,
                        (error: Error) => {
                            if (error) {
                                callbackChannel(false, error?.message, null);
                            }
                        }
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
            cbGetMessage(msg);
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
     * @param callback
     */
    @waitConnect(1000)
    public sendingMsg(
        msg: string,
        callback: (
            isOk: boolean,
            errorMsg: string,
            channel: amqp.Channel | null
        ) => void
    ) {
        this.connect?.createChannel((error: Error, ch) => {
            if (this.closeOnErr(error)) return;

            if (!ch) return callback(false, error.message, null);

            ch.assertExchange(
                this.config.send_exchange,
                this.config.send_exchange_type ||
                    defaultConfig.send_exchange_type,
                this.config.channel.send || defaultConfig.channel.send,
                (error) => {
                    if (error) callback(false, error.message, null);
                }
            );

            const sendingIsSuccess = ch.publish(
                this.config.send_exchange,
                this.config.send_routing_key || "",
                Buffer.from(msg)
            );

            callback(sendingIsSuccess, "", ch);
        });
    }

    /**
     * Получаем инстанс соединения с rabbitMQ
     */
    getConnect() {
        return this.connect;
    }
}
