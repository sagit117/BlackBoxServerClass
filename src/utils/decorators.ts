import routes from "../domains/Routes";

export function GET(path: string) {
    return function (
        _target: any,
        method: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        console.log(_target);
        routes.addRoute(path, method, "get");

        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args);
        };
    };
}

export function POST(path: string) {
    return function (
        _target: any,
        method: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        console.log(_target);

        routes.addRoute(path, method, "post");

        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args);
        };
    };
}

export function DELETE(path: string) {
    return function (
        _target: any,
        method: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        console.log(_target);

        routes.addRoute(path, method, "delete");

        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args);
        };
    };
}
