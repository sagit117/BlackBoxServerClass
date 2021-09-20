import { blackbox } from "../../../index.d";
import Mongoose from "mongoose";

export default class MongodbService {
    private config: blackbox.IConfigMongo;

    constructor(config: blackbox.IConfigMongo) {
        console.log("created MongodbService");

        this.config = config;
    }

    /**
     * Создает соединение с БД
     */
    public connect(callback: (conn: typeof Mongoose | Error) => void) {
        Mongoose.connect(
            `mongodb://${this.config.host}:${this.config.port}${this.config.string_options}`,
            {
                autoIndex: true,
                dbName: this.config.db_name,
                user: this.config.user_name,
                pass: this.config.password,
            }
        )
            .then((res) => {
                callback(res);
            })
            .catch((error: Error) => {
                callback(error);
            });
    }
}
