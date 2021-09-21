import Mongoose from "mongoose";
export default class MongodbService {
    config;
    constructor(config) {
        console.log("created MongodbService");
        this.config = config;
    }
    /**
     * Создает соединение с БД
     */
    connect(callback) {
        Mongoose.connect(`mongodb://${this.config.host}:${this.config.port}${this.config.string_options}`, {
            autoIndex: true,
            dbName: this.config.db_name,
            user: this.config.user_name,
            pass: this.config.password,
        })
            .then((res) => {
            callback(res);
        })
            .catch((error) => {
            callback(error);
        });
    }
}
//# sourceMappingURL=mongodb.service.js.map