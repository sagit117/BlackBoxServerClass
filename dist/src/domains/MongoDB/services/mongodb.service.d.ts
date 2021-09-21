import { blackbox } from "../../../index.d";
import Mongoose from "mongoose";
export default class MongodbService {
    private config;
    constructor(config: blackbox.IConfigMongo);
    /**
     * Создает соединение с БД
     */
    connect(callback: (conn: typeof Mongoose | Error) => void): void;
}
//# sourceMappingURL=mongodb.service.d.ts.map