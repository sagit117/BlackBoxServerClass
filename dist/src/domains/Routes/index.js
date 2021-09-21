/**
 * Класс отвечает за авто составление маршрутов
 */
class Routes {
    routes = [];
    controllers = [];
    addRoute(route, method, type) {
        this.routes.push({ route, method, type });
    }
    addControllers(name, path) {
        this.controllers.push({ name, routes: this.routes, path });
        this.clearRoutes();
    }
    getRoutes(name) {
        return this.controllers.find((c) => c.name === name);
    }
    clearRoutes() {
        this.routes = [];
    }
}
const routes = new Routes();
export default routes;
//# sourceMappingURL=index.js.map