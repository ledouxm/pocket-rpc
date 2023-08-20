import { ApiClient, type Fetcher, type Payload } from "@pocket-rpc/client";
import { type Method, type Router } from "@pocket-rpc/server";
import { ofetch } from "ofetch";

export const makeOfetchClient = <R extends Router>() => {
    return new ApiClient<R>(makeOfetchFetcher());
};

const makeOfetchFetcher = (): Fetcher => {
    return async (method: Method, path: string, payload: Payload) => {
        const response = await ofetch(path, {
            method,
            ...payload,
        });

        return response;
    };
};

export type { ApiClient };
