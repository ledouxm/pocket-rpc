# pocket-rpc

Easy to build full typesafe api router

Largely inspired by [tRPC](https://github.com/trpc/trpc)

# Installation

## Server-side:

```
pnpm install @pocket-rpc/server @pocket-rpc/fastify @sinclair/typebox
```

## Client-side:

```
pnpm install @pocket-rpc/ofetch
```

Alternatively, you can use @pocket-rpc/ky or @pocket-rpc/axios, or even create a custom one with @pocket-rpc/client

# Usage

## Defining router

```ts
import { makeRouter, route } from "@pocket-rpc/server";
import { Type } from "@sinclair/typebox";

const loginRoute = route({
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
});

const router = makeRouter({
    // path of this route will be /login
    login: loginRoute,
});

// this will be used client-side
export type AppRouter = typeof router;
```

A router can contain multiple routes and/or multiple routers, it will get flatten with a "/" separator

```ts
const authRouter = makeRouter({ login: loginRoute });
const dataRouter = makeRouter({ getData: getDataRoute });

const router = makeRouter({
    auth: authRouter,
    data: dataRouter,
});
```

In this case, the paths will be :

-   /auth/login
-   /data/getData

## Usage with Fastify

```ts
const fastifyInstance = makeFastifyRouter(router);

// You can use fastify as usual for example:
fastifyInstance.register(cors);
fastifyInstance.listen({ port: 8080 });
```

## Client side usage

You can choose between the 3 existing clients (ofetch, axios or ky), or create a custom one

### Ofetch

```ts
import type { AppRouter } from "../path/to/server/router";
import { makeOfetchClient } from "@pocket-rpc/ofetch";

export const api = makeOfetchClient<AppRouter>({
    baseURL: "http://localhost:8080",
});

api.post("auth/login", {
    body: {
        username: "...",
        password: "...",
    },
});
```

### Axios

```ts
import { makeAxiosClient } from "@pocket-rpc/axios";
```

### Ky

```ts
import { makeKyClient } from "@pocket-rpc/ky";
```

### Custom

You must define a Fetcher such as:

```ts
import { type Fetcher, ApiClient } from "@pocket-rpc/client";

const makeAxiosFetcher = (): Fetcher => {
    const axiosInstance = axios.create();

    return async (method: Method, path: string, payload: Payload) => {
        const response = await axiosInstance.request({
            method,
            url: path,
            params: payload?.query,
            data: payload?.body,
            headers: payload?.headers,
        });

        return response.data;
    };
};
```

Then you can use it with ApiClient

```ts
const api = new ApiClient<AppRouter>(makeAxiosFetcher());
```
