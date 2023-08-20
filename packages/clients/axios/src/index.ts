import { ApiClient, type Fetcher, type Payload } from "@pocket-rpc/client";
import { type Method, type Router } from "@pocket-rpc/server";
import axios from "axios";

export const makeAxiosClient = <R extends Router>() => {
    return new ApiClient<R>(makeAxiosFetcher());
};

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

export type { ApiClient };
