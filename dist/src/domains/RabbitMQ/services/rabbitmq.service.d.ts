import { blackbox } from "../../../index.d";
import amqp from "amqplib/callback_api";
export default class RabbitmqService {
    private config;
    private connect;
    constructor(config: blackbox.IConfigRabbit);
    /**
     * Соединение с rabbitMQ
     * @param callbackConnect
     * @param callbackChannel
     * @param cbGetMessage
     */
    connectRabbit(callbackConnect: (isOk: boolean, errorMsg: string, connection: amqp.Connection | null) => void, callbackChannel: (isOk: boolean, errorMsg: string, channel: amqp.Channel | null) => void, cbGetMessage: (msg: amqp.Message) => void): void;
    private receiveMsg;
    /**
     * Обработка ошибок канала и очередей
     * @param error
     */
    private closeOnErr;
    /**
     * Канал для отправки
     * @param msg - сообщение для отправки
     * @param callback
     */
    sendingMsg(msg: string, callback: (isOk: boolean, errorMsg: string, channel: amqp.Channel | null) => void): void;
    /**
     * Получаем инстанс соединения с rabbitMQ
     */
    getConnect(): amqp.Connection | undefined;
}
//# sourceMappingURL=rabbitmq.service.d.ts.map