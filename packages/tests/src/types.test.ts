import { describe, expectTypeOf, it } from "vitest";
import type { ResponseOf, Route, SchemaOf } from "@pocket-rpc/server";
import { TestRouter } from "./utils";

describe("types tests", () => {
    it("should check route creation types using route helper", () => {
        type RouteMethodOf<T extends Route<any, any, any>> = T["method"];

        // method type
        expectTypeOf<
            RouteMethodOf<TestRouter["hello"]>
        >().toEqualTypeOf<"get">();
        expectTypeOf<
            RouteMethodOf<TestRouter["nested/withArray"]>
        >().toEqualTypeOf<"post">();
        expectTypeOf<
            RouteMethodOf<TestRouter["nested/withAll"]>
        >().toEqualTypeOf<"patch">();
        expectTypeOf<
            RouteMethodOf<TestRouter["withHeaders"]>
        >().toEqualTypeOf<"delete">();

        // schema type
        expectTypeOf<SchemaOf<TestRouter, "hello">>().toEqualTypeOf<{}>();
        expectTypeOf<SchemaOf<TestRouter, "nested/withArray">>().toEqualTypeOf<{
            body: number[];
            query: { id: number };
        }>();
        expectTypeOf<SchemaOf<TestRouter, "nested/withAll">>().toEqualTypeOf<{
            body: { id: number };
            query: { id: number };
            headers: { id: number };
        }>();
        expectTypeOf<SchemaOf<TestRouter, "withHeaders">>().toEqualTypeOf<{
            headers: { id: number };
        }>();

        // response type
        expectTypeOf<ResponseOf<TestRouter, "hello">>().toEqualTypeOf<string>();
        expectTypeOf<
            ResponseOf<TestRouter, "nested/withArray">
        >().toEqualTypeOf<number>();
        expectTypeOf<
            ResponseOf<TestRouter, "nested/withAll">
        >().toEqualTypeOf<number>();
        expectTypeOf<
            ResponseOf<TestRouter, "withHeaders">
        >().toEqualTypeOf<number>();
    });
});
