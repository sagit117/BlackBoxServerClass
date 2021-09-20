export type TTypeRoute =
    | "get"
    | "post"
    | "delete"
    | "put"
    | "all"
    | "patch"
    | "options"
    | "head";

interface IRoutes {
    route: string;
    method: string;
    type: TTypeRoute;
}

/**
 * Класс отвечает за авто составление маршрутов
 */
class Routes {
    private routes: IRoutes[] = [];
    private controllers: {
        name: string;
        routes: IRoutes[];
        path: string;
        [k: string]: any;
    }[] = [];

    public addRoute(route: string, method: string, type: TTypeRoute) {
        this.routes.push({ route, method, type });
    }

    public addControllers(name: string, path: string) {
        this.controllers.push({ name, routes: this.routes, path });
        this.clearRoutes();
    }

    public getRoutes(name: string) {
        return this.controllers.find((c) => c.name === name);
    }

    private clearRoutes() {
        this.routes = [];
    }
}

const routes = new Routes();
export default routes;
