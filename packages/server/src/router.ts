import {
    AnyRouteMap,
    FlattenedRouter,
    Method,
    Route,
    RouteSchema,
} from "./types";

export const isARoute = (route: any): route is Route<any, any, any> => {
    return route.method !== undefined;
};

const flattenRouter = <const R extends AnyRouteMap>(router: R) => {
    const obj: any = {};

    Object.entries(router).forEach(([name, route]) => {
        if (isARoute(route)) {
            obj[name] = route;
        } else {
            // @ts-ignore reccursive error
            const flattened = flattenRouter(route);
            Object.entries(flattened).forEach(([name2, route2]) => {
                obj[`${name}/${name2}`] = route2;
            });
        }
    });

    return obj as FlattenedRouter<R>;
};

export const route = <E extends RouteSchema, M extends Method, R>(
    route: Route<E, M, R>
) => route;
export const makeRouter = <E extends AnyRouteMap>(
    routes: E
): FlattenedRouter<E> => flattenRouter(routes);
