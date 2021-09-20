export type TTypeRoute =
    | "get"
    | "post"
    | "delete"
    | "put"
    | "all"
    | "patch"
    | "options"
    | "head";

class Routes {
    private routes: { route: string; method: string; type: TTypeRoute }[] = [];

    public addRoute(route: string, method: string, type: TTypeRoute) {
        this.routes.push({ route, method, type });
    }

    public getRoutes() {
        return this.routes;
    }

    public clearRoutes() {
        this.routes = [];
    }
}

const routes = new Routes();
export default routes;
