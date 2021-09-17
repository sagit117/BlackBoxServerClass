import RabbitmqService from "./services/rabbitmq.service";

export function waitConnect(repeat: number) {
    return function (
        target: Object,
        method: string,
        descriptor: PropertyDescriptor
    ) {
        /**
         * Оригинальный метод
         */
        const originMethod = descriptor.value;

        /**
         * Подмена оригинального метода
         */
        descriptor.value = function (...args: any) {
            const isConnect = (this as RabbitmqService).getConnect();

            if (!isConnect) {
                return new Promise((resolve) => {
                    /**
                     * Вернем оригинальный метод с задержкой
                     */
                    setTimeout(
                        // @ts-ignore
                        () => resolve(target[method].apply(this, args)),
                        +repeat || 1000
                    );
                });
            } else {
                /**
                 * Вернем оригинальный метод с текущим контекстом
                 */
                return originMethod.apply(this, args);
            }
        };
    };
}
