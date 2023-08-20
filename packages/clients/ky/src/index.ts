import { ApiClient, type Fetcher, type Payload } from "@pocket-rpc/client";
import { type Method, type Router } from "@pocket-rpc/server";
import ky from "ky-universal";

export const makeKyClient = <R extends Router>() => {
    return new ApiClient<R>(makeKyFetcher());
};

const makeKyFetcher = (): Fetcher => {
    return async (method: Method, path: string, payload: Payload) => {
        const response = await ky[method](path, {
            searchParams: payload?.query,
            json: payload?.body,
            headers: payload?.headers,
        });

        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return response.json();
        }

        return response.text();
    };
};

export type { ApiClient };
