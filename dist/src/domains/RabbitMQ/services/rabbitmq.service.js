var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    config;
    connect;
    constructor(config) {
        console.log("created RabbitmqService");
        this.config = config;
    }
    /**
     * Соединение с rabbitMQ
     * @param callbackConnect
     * @param callbackChannel
     * @param cbGetMessage
     */
    connectRabbit(callbackConnect, callbackChannel, cbGetMessage) {
        amqp.connect(this.config.url, (error, connection) => {
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
    receiveMsg(callbackChannel, cbGetMessage) {
        this.connect?.createChannel((error, ch) => {
            if (this.closeOnErr(error))
                return;
            callbackChannel(true, "", ch);
            /**
             * Процесс обработки получения сообщений
             * @param msg
             */
            const processMsg = (msg) => {
                work(msg, (ok) => {
                    try {
                        if (ok)
                            ch.ack(msg);
                        else
                            ch.reject(msg, true);
                    }
                    catch (e) {
                        this.closeOnErr(e);
                    }
                });
            };
            /** ==== */
            ch.prefetch(this.config?.prefetch || defaultConfig.prefetch);
            ch.assertQueue(this.config.receive_queue_name, this.config.channel.receive, (err, _ok) => {
                if (this.closeOnErr(err))
                    return;
                ch.consume(this.config.receive_queue_name, processMsg, this.config.channel.consume ||
                    defaultConfig.channel.consume, (error) => {
                    if (error) {
                        callbackChannel(false, error?.message, null);
                    }
                });
            });
            /**
             * Байнд маршрутов
             */
            ch.bindQueue(this.config.receive_queue_name, this.config.receive_exchange || "", this.config.receive_routing_key || "");
        });
        /**
         * Обработка полученных сообщений
         * @param msg
         * @param cb
         */
        function work(msg, cb) {
            cbGetMessage(msg);
            cb(true);
        }
    }
    /**
     * Обработка ошибок канала и очередей
     * @param error
     */
    closeOnErr(error) {
        if (!error)
            return false;
        this.connect?.close();
        return true;
    }
    /**
     * Канал для отправки
     * @param msg - сообщение для отправки
     * @param callback
     */
    sendingMsg(msg, callback) {
        this.connect?.createChannel((error, ch) => {
            if (this.closeOnErr(error))
                return;
            if (!ch)
                return callback(false, error.message, null);
            ch.assertExchange(this.config.send_exchange, this.config.send_exchange_type ||
                defaultConfig.send_exchange_type, this.config.channel.send || defaultConfig.channel.send, (error) => {
                if (error)
                    callback(false, error.message, null);
            });
            const sendingIsSuccess = ch.publish(this.config.send_exchange, this.config.send_routing_key || "", Buffer.from(msg));
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
__decorate([
    waitConnect(1000)
], RabbitmqService.prototype, "sendingMsg", null);
//# sourceMappingURL=rabbitmq.service.js.map