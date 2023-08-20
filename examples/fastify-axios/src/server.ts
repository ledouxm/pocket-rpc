import { makeRouter, route } from "@pocket-rpc/server";
import { makeFastifyRouter } from "../../../packages/adapters/fastify/dist";

const router = makeRouter({
    hello: route({
        schema: {},
        method: "get",
        handler: () => "world",
    }),
});

export type AppRouter = typeof router;

const app = makeFastifyRouter(router);
app.listen({ port: 3000 }).then((address) =>
    console.log("listening on", address)
);
