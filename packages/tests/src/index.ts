import { Type } from "@sinclair/typebox";
import { Method, makeRouter, route } from "@pocket-rpc/server";

export const testRouter = makeRouter({
    hello: route({
        method: "get",
        schema: {},
        handler: () => "world",
    }),
    withBodyPost: route({
        method: "post",
        schema: {
            body: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: (req) => req.body.id,
    }),
    withBodyPut: route({
        method: "put",
        schema: {
            body: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: (req) => req.body.id,
    }),
    withQuery: route({
        method: "get",
        schema: {
            query: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: (req) => req.query.id,
    }),
    withHeaders: route({
        method: "delete",
        schema: {
            headers: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: (req) => req.headers.id,
    }),
    nested: {
        withAll: route({
            method: "post",
            schema: {
                body: Type.Object({
                    id: Type.Number(),
                }),
                query: Type.Object({
                    id: Type.Number(),
                }),
                headers: Type.Object({
                    id: Type.Number(),
                }),
            },
            handler: (req) => req.body.id + req.query.id + req.headers.id,
        }),
        withArray: route({
            method: "post",
            schema: {
                body: Type.Array(Type.Number()),
                query: Type.Object({
                    id: Type.Number(),
                }),
            },
            handler: (req) => req.body.reduce((a, b) => a + b, 0),
        }),
    },
});

export type TestRouter = typeof testRouter;

export const testsWithExpectedResults: {
    path: string;
    method: Method;
    payload: any;
    expected: any;
}[] = [
    {
        path: "hello",
        method: "get",
        payload: {},
        expected: "world",
    },
    {
        path: "withBodyPost",
        method: "post",
        payload: { body: { id: 2 } },
        expected: 2,
    },
    {
        path: "withBodyPut",
        method: "put",
        payload: { body: { id: 2 } },
        expected: 2,
    },
    {
        path: "withQuery",
        method: "get",
        payload: { query: { id: 2 } },
        expected: 2,
    },
    {
        path: "withHeaders",
        method: "delete",
        payload: { headers: { id: 2 } },
        expected: 2,
    },
    {
        path: "nested/withAll",
        method: "post",
        payload: { body: { id: 1 }, query: { id: 10 }, headers: { id: 100 } },
        expected: 111,
    },
    {
        path: "nested/withArray",
        method: "post",
        payload: { body: [1, 2, 3], query: { id: 2 } },
        expected: 6,
    },
];
