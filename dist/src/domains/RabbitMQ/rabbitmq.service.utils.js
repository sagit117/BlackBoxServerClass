export function waitConnect(repeat) {
    return function (target, method, descriptor) {
        /**
         * Оригинальный метод
         */
        const originMethod = descriptor.value;
        /**
         * Подмена оригинального метода
         */
        descriptor.value = function (...args) {
            const isConnect = this.getConnect();
            if (!isConnect) {
                return new Promise((resolve) => {
                    /**
                     * Вернем оригинальный метод с задержкой
                     */
                    setTimeout(
                    // @ts-ignore
                    () => resolve(target[method].apply(this, args)), +repeat || 1000);
                });
            }
            else {
                /**
                 * Вернем оригинальный метод с текущим контекстом
                 */
                return originMethod.apply(this, args);
            }
        };
    };
}
//# sourceMappingURL=rabbitmq.service.utils.js.map