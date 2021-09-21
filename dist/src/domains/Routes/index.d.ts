export declare type TTypeRoute = "get" | "post" | "delete" | "put" | "all" | "patch" | "options" | "head";
interface IRoutes {
    route: string;
    method: string;
    type: TTypeRoute;
}
/**
 * Класс отвечает за авто составление маршрутов
 */
declare class Routes {
    private routes;
    private controllers;
    addRoute(route: string, method: string, type: TTypeRoute): void;
    addControllers(name: string, path: string): void;
    getRoutes(name: string): {
        [k: string]: any;
        name: string;
        routes: IRoutes[];
        path: string;
    } | undefined;
    private clearRoutes;
}
declare const routes: Routes;
export default routes;
//# sourceMappingURL=index.d.ts.map