# pocket-rpc

Easy to build full typesafe api router

Largely inspired by [tRPC](https://github.com/trpc/trpc)

# Installation

Server side: `pnpm install @pocket-rpc/server @pocket-rpc/fastify fastify @sinclair/typebox`

Client side: `pnpm install @pocket-rpc/axios`

# Usage

## Server side

```ts
import { makeRouter, route } from "@pocket-rpc/server";
import { makeFastifyRouter } from "@pocket-rpc/fastify";

import { Type } from "@sinclair/typebox";

const router = makeRouter({
    auth: {
        login: route({
            method: "post",
            schema: {
                body: Type.Object({
                    username: Type.String(),
                    password: Type.String(),
                }),
            },
            handler: (ctx) => {
                const { body } = ctx;
                //       ^? type { username: string, password: string }

                return login(body);
            },
        }),
        logout: route({
            method: "post",
            schema: {}, // mandatory even if nothing is required
            handler: () => {
                // ...
            },
        }),
    },
    getResults: route({
        method: "get",
        schema: {
            query: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: ({ query }) => {
            return query.id;
            //            ^? type number
        },
    }),
});

export type AppRouter = typeof router;

const fastifyInstance: FastifyInstance = makeFastifyRouter(router);
fastifyInstance.listen({ port: 8080 });
```

A router can contain multiple routes or/and multiple routers, it will get flatten with a "/" separator, in this case there will be 3 routes :

-   auth/login
-   auth/logout
-   getResults

## Client side

```ts
import type { AppRouter } from "../path/to/server/router";
import { makeAxiosClient } from "@pocket-rpc/axios";

export const api = makeAxiosClient<AppRouter>({
    baseURL: "http://localhost:8080",
});

api.post("auth/login", {
    body: {
        username: "...",
        password: "...",
    },
});
```
