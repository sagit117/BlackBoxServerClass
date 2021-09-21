import routes from "../domains/Routes";
export function GET(path) {
    return function (_target, method, descriptor) {
        const originalMethod = descriptor.value;
        routes.addRoute(path, method, "get");
        descriptor.value = function (...args) {
            return originalMethod.apply(this, args);
        };
    };
}
export function POST(path) {
    return function (_target, method, descriptor) {
        const originalMethod = descriptor.value;
        routes.addRoute(path, method, "post");
        descriptor.value = function (...args) {
            return originalMethod.apply(this, args);
        };
    };
}
export function PUT(path) {
    return function (_target, method, descriptor) {
        const originalMethod = descriptor.value;
        routes.addRoute(path, method, "put");
        descriptor.value = function (...args) {
            return originalMethod.apply(this, args);
        };
    };
}
export function DELETE(path) {
    return function (_target, method, descriptor) {
        const originalMethod = descriptor.value;
        routes.addRoute(path, method, "delete");
        descriptor.value = function (...args) {
            return originalMethod.apply(this, args);
        };
    };
}
export function controller(path) {
    return function (target) {
        if (typeof path !== "string") {
            throw new Error("Request path must be string");
        }
        routes.addControllers(target.name, path);
    };
}
//# sourceMappingURL=decorators.js.map