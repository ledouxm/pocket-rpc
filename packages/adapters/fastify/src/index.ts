import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { RouteSchema, Router } from "@pocket-rpc/server";
import Fastify, { FastifyServerOptions } from "fastify";

export const makeFastifyRouter = <R extends Router>(
    router: R,
    fastifyOpts: FastifyServerOptions = {}
) => {
    const fastify =
        Fastify(fastifyOpts).withTypeProvider<TypeBoxTypeProvider>();

    Object.entries(router).forEach(([name, route]) => {
        fastify.route({
            method: route.method,
            url: `/${name}`,
            schema: transformSchema(route.schema),
            handler: async (req) => {
                const { headers, query, body } = req;
                const payload = {
                    body,
                    query,
                    headers,
                };

                return await route.handler(payload);
            },
        });
    });

    return fastify;
};

const transformSchema = (schema: RouteSchema) => {
    const { body, query, headers, response } = schema;

    return removeUndefineds({
        body,
        querystring: query,
        headers,
        response,
    });
};

const removeUndefineds = (obj: any) => {
    const newObj: any = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined) {
            newObj[key] = value;
        }
    });
    return newObj;
};
