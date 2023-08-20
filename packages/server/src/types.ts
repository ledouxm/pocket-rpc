import { TAnySchema, Static } from "@sinclair/typebox";

export type Awaitable<T> = Promise<T> | T;

export type Method = "get" | "post" | "put" | "delete" | "patch";

export type RouteSchema = {
    query?: TAnySchema;
    body?: TAnySchema;
    headers?: TAnySchema;
    response?: TAnySchema;
};

export type RouteContext<T extends RouteSchema> = {
    [K in keyof T]: T[K] extends TAnySchema ? Static<T[K]> : never;
};

export type Route<E extends RouteSchema, M extends Method, R> = {
    method: M;
    schema: E;
    handler: (ctx: RouteContext<E>) => Awaitable<R>;
};

export type RouteMap<E> = {
    [K in keyof E]: E[K] extends RouteSchema ? Route<E[K], Method, any> : RouteMap<E[K]>;
};

export type AnyRouteMap = RouteMap<any>;

type IsRoute<T> = T extends Route<any, any, any> ? T : false;

type FlattenRouter<E, Acc = {}, Prefix extends string = ""> = {
    [K in keyof E]: IsRoute<E[K]> extends Route<any, any, any>
        ? {
              [P in K as `${AddSlash<Prefix>}${P extends string ? P : ""}`]: IsRoute<E[P]>;
          } & Acc
        : FlattenRouter<E[K], Acc, K extends string ? K : "">;
}[keyof E];

type AddSlash<T extends string> = T extends "" ? "" : `${T}/`;

export type FlattenedRouter<T extends AnyRouteMap> = Simplify<
    UnionToIntersection<FlattenRouter<T>>
>;

type Simplify<T> = T extends unknown ? { [K in keyof T]: T[K] } : T;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

export type Router = {
    [key: string]: Route<any, any, any>;
};

export type MethodsOf<T extends Router, M extends Method = "get"> = {
    [K in keyof T as T[K]["method"] extends M ? K : never]: T[K];
};

export type SchemaOf<R extends Router, T extends keyof R> = RouteContext<R[T]["schema"]>;

export type ResponseOf<R extends Router, T extends keyof R> = R[T] extends Route<any, any, any>
    ? Awaited<ReturnType<R[T]["handler"]>>
    : never;
