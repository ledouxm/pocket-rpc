import { describe, it, expect } from "vitest";
import { makeFastifyRouter } from "../src";
import { testRouter } from "../../../tests/src";

describe("fastify tests", () => {
    it("should create a fastify server without errors", async () => {
        const router = makeFastifyRouter(testRouter, {});
        expect(router).toBeDefined();

        const str = await router.listen({ port: 3000 });
        expect(str).toBeDefined();
    });
});
