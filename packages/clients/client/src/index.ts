import type {
    Router,
    Method,
    Awaitable,
    MethodsOf,
    ResponseOf,
    SchemaOf,
} from "@pocket-rpc/server";

export class ApiClient<R extends Router> {
    baseUrl = "";
    constructor(public fetcher: Fetcher) {}

    setBaseUrl(url: string) {
        if (!url.endsWith("/")) {
            url += "/";
        }

        this.baseUrl = url;
        return this;
    }

    get<P extends keyof MethodsOf<R>>(
        path: P,
        payload: SchemaOf<R, P>
    ): Promise<ResponseOf<R, P>> {
        return this.fetcher("get", this.baseUrl + (path as string), payload);
    }

    post<P extends keyof MethodsOf<R, "post">>(
        path: P,
        payload: SchemaOf<R, P>
    ): Promise<ResponseOf<R, P>> {
        return this.fetcher("post", this.baseUrl + (path as string), payload);
    }

    put<P extends keyof MethodsOf<R, "put">>(
        path: P,
        payload: SchemaOf<R, P>
    ): Promise<ResponseOf<R, P>> {
        return this.fetcher("put", this.baseUrl + (path as string), payload);
    }

    delete<P extends keyof MethodsOf<R, "delete">>(
        path: P,
        payload: SchemaOf<R, P>
    ): Promise<ResponseOf<R, P>> {
        return this.fetcher("delete", this.baseUrl + (path as string), payload);
    }

    patch<P extends keyof MethodsOf<R, "patch">>(
        path: P,
        payload: SchemaOf<R, P>
    ): Promise<ResponseOf<R, P>> {
        return this.fetcher("patch", this.baseUrl + (path as string), payload);
    }
}

export type Payload = {
    query?: any;
    body?: any;
    headers?: any;
};

export type Fetcher = (
    method: Method,
    path: string,
    payload: Payload
) => Promise<any>;
