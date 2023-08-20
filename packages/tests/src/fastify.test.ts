import { Type } from "@sinclair/typebox";
import { ApiClient, makeAxiosClient } from "@pocket-rpc/axios";
import { makeRouter, route } from "@pocket-rpc/server";
import { makeFastifyRouter } from "@pocket-rpc/fastify";
import { describe, expect, it } from "vitest";
import { TestRouter, testRouter, testsWithExpectedResults } from "./utils";
import { makeKyClient } from "@pocket-rpc/ky";
import { makeOfetchClient } from "@pocket-rpc/ofetch";

describe("RPC tests using axios and fastify", () => {
    it("should start a fastify http server", async () => {
        const server = await makeFastifyRouter(testRouter).listen({
            port: 3000,
        });
        expect(server).toBeDefined();
    });

    const ref = {
        client: null as any as ApiClient<TestRouter>,
    };

    const executeClientTests = (name: string) => {
        testsWithExpectedResults.forEach(
            ({ path, method, payload, expected }) => {
                it(`should make a request to ${path} with ${name}`, async () => {
                    try {
                        const response = await ref.client[method](
                            path,
                            payload
                        );

                        expect(response).toEqual(expected);
                    } catch (e) {
                        console.log(e);
                        throw e;
                    }
                });
            }
        );
    };

    it("should create an axios client", async () => {
        ref.client = makeAxiosClient<TestRouter>().setBaseUrl(
            "http://localhost:3000/"
        );
        expect(ref.client).toBeDefined();
    });

    executeClientTests("axios");

    it("should create a ky client", async () => {
        ref.client = makeKyClient<TestRouter>().setBaseUrl(
            "http://localhost:3000/"
        );
        expect(ref.client).toBeDefined();
    });

    executeClientTests("ky");

    it("should create an ofetch client", async () => {
        ref.client = makeOfetchClient<TestRouter>().setBaseUrl(
            "http://localhost:3000/"
        );

        expect(ref.client).toBeDefined();
    });

    executeClientTests("ofetch");
});
